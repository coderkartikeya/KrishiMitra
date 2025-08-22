'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Camera, RotateCcw, ArrowRight, Leaf, IdCard, Sparkles, Upload, CheckCircle, Shield, Eye } from 'lucide-react';

const signText = {
	en: {
		signup: 'Sign up',
		title: 'Create your account',
		sub: 'Take a selfie and upload your Aadhaar card photo. We skip verification for now.',
		selfie: 'Selfie',
		captureSelfie: 'Capture Selfie',
		retakeSelfie: 'Retake Selfie',
		aadhaar: 'Aadhaar Card',
		uploadAadhaar: 'Upload Aadhaar Photo',
		continue: 'Continue to Dashboard',
		loginQ: 'Already have an account?',
		loginNow: 'Login',
		cameraBlocked: 'Camera access is blocked. Please allow camera permission.',
		ready: 'Ready to capture',
		processing: 'Processing...',
		uploaded: 'Uploaded successfully',
		dropFiles: 'Drop files here or click to browse',
		fileSupport: 'JPEG, PNG up to 10MB'
	},
	hi: {
		signup: 'साइन अप',
		title: 'अपना खाता बनाएं',
		sub: 'एक सेल्फी लें और आधार कार्ड की फोटो अपलोड करें। अभी सत्यापन स्किप किया गया है।',
		selfie: 'सेल्फी',
		captureSelfie: 'सेल्फी लें',
		retakeSelfie: 'फिर से लें',
		aadhaar: 'आधार कार्ड',
		uploadAadhaar: 'आधार फोटो अपलोड करें',
		continue: 'डैशबोर्ड पर जाएं',
		loginQ: 'पहले से खाता है?',
		loginNow: 'लॉगिन',
		cameraBlocked: 'कैमरा एक्सेस ब्लॉक है। कृपया अनुमति दें।',
		ready: 'कैप्चर के लिए तैयार',
		processing: 'प्रसंस्करण...',
		uploaded: 'सफलतापूर्वक अपलोड',
		dropFiles: 'फाइलें यहां छोड़ें या ब्राउज़ करने के लिए क्लिक करें',
		fileSupport: 'JPEG, PNG 10MB तक'
	},
	es: {
		signup: 'Regístrate',
		title: 'Crea tu cuenta',
		sub: 'Toma una selfie y sube la foto de tu Aadhaar. Por ahora omitimos la verificación.',
		selfie: 'Selfie',
		captureSelfie: 'Tomar selfie',
		retakeSelfie: 'Repetir selfie',
		aadhaar: 'Tarjeta Aadhaar',
		uploadAadhaar: 'Subir foto de Aadhaar',
		continue: 'Continuar al panel',
		loginQ: '¿Ya tienes cuenta?',
		loginNow: 'Inicia sesión',
		cameraBlocked: 'El acceso a la cámara está bloqueado. Permite el permiso.',
		ready: 'Listo para capturar',
		processing: 'Procesando...',
		uploaded: 'Subido exitosamente',
		dropFiles: 'Suelta archivos aquí o haz clic para navegar',
		fileSupport: 'JPEG, PNG hasta 10MB'
	}
};

export default function SignupPage() {
	const router = useRouter();
	const selfieVideoRef = useRef(null);
	const selfieCanvasRef = useRef(null);
	const streamRef = useRef(null);
	const [selfie, setSelfie] = useState('');
	const [aadhar, setAadhar] = useState('');
	const [cameraError, setCameraError] = useState('');
	const [currentLanguage, setCurrentLanguage] = useState('en');
	const [isLoading, setIsLoading] = useState(false);
	const [cameraReady, setCameraReady] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);
	const [uploadSuccess, setUploadSuccess] = useState(false);
	const [isDragOver, setIsDragOver] = useState(false);
	

	const t = useMemo(() => signText[currentLanguage] || signText.en, [currentLanguage]);

	// Function to stop camera stream
	const stopCamera = () => {
		if (streamRef.current) {
			streamRef.current.getTracks().forEach(track => track.stop());
			streamRef.current = null;
		}
		if (selfieVideoRef.current) {
			selfieVideoRef.current.srcObject = null;
		}
		setCameraReady(false);
	};

	useEffect(() => {
		const startCamera = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
				streamRef.current = stream;
				
				if (selfieVideoRef.current) {
					selfieVideoRef.current.srcObject = stream;
					selfieVideoRef.current.onloadedmetadata = () => {
						setCameraReady(true);
					};
				}
				setCameraError('');
			} catch (e) {
				setCameraError(t.cameraBlocked);
			}
		};
		
		if (!selfie) {
			startCamera();
		}
		
		return () => {
			stopCamera();
		};
	}, [t.cameraBlocked, selfie]);

	// Cleanup when component unmounts or page is about to unload
	useEffect(() => {
		const handleBeforeUnload = () => {
			stopCamera();
		};

		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	}, []);

	const captureSelfie = async () => {
		const v = selfieVideoRef.current;
		const c = selfieCanvasRef.current;
		if (!v || !c) return;
		
		setIsLoading(true);
		
		// Simulate capture delay
		await new Promise(resolve => setTimeout(resolve, 500));
		
		c.width = v.videoWidth || 640;
		c.height = v.videoHeight || 480;
		const ctx = c.getContext('2d');
		ctx.drawImage(v, 0, 0, c.width, c.height);
		setSelfie(c.toDataURL('image/jpeg', 0.9));
		setShowSuccess(true);
		setIsLoading(false);
		
		// Stop the camera after capturing
		stopCamera();
		
		// Hide success after 2 seconds
		setTimeout(() => setShowSuccess(false), 2000);
	};

	const retakeSelfie = async () => {
		setSelfie('');
		setShowSuccess(false);
		
		// Camera will restart via useEffect when selfie is cleared
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		setIsDragOver(true);
	};

	const handleDragLeave = (e) => {
		e.preventDefault();
		setIsDragOver(false);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		setIsDragOver(false);
		const files = e.dataTransfer.files;
		if (files[0]) {
			processFile(files[0]);
		}
	};

	const processFile = async (file) => {
		if (!file) return;
		
		setIsLoading(true);
		
		// Simulate upload delay
		await new Promise(resolve => setTimeout(resolve, 1000));
		
		const reader = new FileReader();
		reader.onload = () => {
			setAadhar(String(reader.result));
			setUploadSuccess(true);
			setIsLoading(false);
			
			// Hide success after 3 seconds
			setTimeout(() => setUploadSuccess(false), 3000);
		};
		reader.readAsDataURL(file);
	};

	const onAadharUpload = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			processFile(file);
		}
	};

	const completeSignup = async () => {
		setIsLoading(true);
		// Stop camera before navigation
		stopCamera();
		// Simulate processing
		await new Promise(resolve => setTimeout(resolve, 1000));
		router.push('/dashboard');
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white relative overflow-hidden">
			{/* Animated background elements */}
			<div className="pointer-events-none absolute inset-0 -z-10">
				<div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-gradient-to-br from-green-200 to-emerald-200 blur-3xl opacity-30 animate-pulse"></div>
				<div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-br from-emerald-200 to-green-200 blur-3xl opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
				<div className="absolute top-1/3 left-1/3 h-64 w-64 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 blur-2xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
			</div>

			{/* Floating particles */}
			<div className="pointer-events-none absolute inset-0 -z-10">
				{[...Array(8)].map((_, i) => (
					<div
						key={i}
						className="absolute w-2 h-2 bg-green-300 rounded-full opacity-40 animate-bounce"
						style={{
							left: `${5 + i * 12}%`,
							top: `${15 + i * 8}%`,
							animationDelay: `${i * 0.4}s`,
							animationDuration: `${2.5 + i * 0.3}s`
						}}
					/>
				))}
			</div>

			<header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-green-100/50 transition-all duration-300">
				<div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
					<div className="flex items-center gap-3 group cursor-pointer">
						<div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl grid place-items-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
							<Leaf className="w-7 h-7 text-white animate-pulse" />
						</div>
						<h1 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
							KrishiMitra
						</h1>
					</div>
					<div className="flex items-center gap-2">
						<Shield className="w-4 h-4 text-green-600" />
						<span className="text-sm font-medium text-gray-600">{t.signup}</span>
					</div>
				</div>
			</header>

			<main className="relative max-w-6xl mx-auto px-4 py-12">
				<div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-green-100/50 overflow-hidden transform-gpu hover:shadow-3xl transition-all duration-500">
					<div className="p-8 sm:p-12">
						{/* Header */}
						<div className="text-center mb-10 animate-in slide-in-from-top duration-700">
							<div className="flex items-center justify-center gap-3 mb-4">
								<div className="relative">
									<Sparkles className="w-8 h-8 text-green-600 animate-pulse" />
									<div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>
								</div>
								<h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
									{t.title}
								</h2>
							</div>
							<p className="text-gray-600 text-lg max-w-2xl mx-auto">{t.sub}</p>
						</div>

						{/* Main Content Grid */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
							{/* Selfie Section */}
							<div className="animate-in slide-in-from-left duration-700 delay-200">
								<div className="flex items-center gap-2 mb-4">
									<Camera className="w-5 h-5 text-green-600" />
									<h3 className="text-xl font-bold text-gray-800">{t.selfie}</h3>
								</div>
								
								<div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border border-gray-200 overflow-hidden aspect-video shadow-inner">
									{!selfie ? (
										<>
											<video 
												ref={selfieVideoRef} 
												autoPlay 
												playsInline 
												muted 
												className={`w-full h-full object-cover transition-all duration-500 ${cameraReady ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
											/>
											{/* Camera overlay UI */}
											<div className="absolute inset-0 pointer-events-none">
												{/* Corner brackets */}
												<div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-green-500 rounded-tl-lg opacity-80"></div>
												<div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-green-500 rounded-tr-lg opacity-80"></div>
												<div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-green-500 rounded-bl-lg opacity-80"></div>
												<div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-green-500 rounded-br-lg opacity-80"></div>
												
												{/* Center target */}
												{cameraReady && (
													<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
														<div className="w-32 h-32 border-2 border-green-400 rounded-full opacity-60 animate-pulse">
															<div className="w-full h-full border-2 border-green-300 rounded-full m-2 animate-ping"></div>
														</div>
													</div>
												)}
												
												{/* Status indicator */}
												{cameraReady && (
													<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500/90 text-white px-4 py-2 rounded-full text-sm font-medium animate-in slide-in-from-bottom">
														<div className="flex items-center gap-2">
															<div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
															{t.ready}
														</div>
													</div>
												)}
											</div>
										</>
									) : (
										<div className="relative w-full h-full animate-in zoom-in duration-500">
											<img src={selfie} alt="Selfie" className="w-full h-full object-cover" />
											{/* Success overlay */}
											{showSuccess && (
												<div className="absolute inset-0 bg-green-500/20 flex items-center justify-center animate-in fade-in duration-500">
													<div className="bg-white/90 rounded-full p-4 shadow-lg animate-in zoom-in duration-300 delay-200">
														<Eye className="w-8 h-8 text-green-600" />
													</div>
												</div>
											)}
										</div>
									)}
									
									{/* Loading overlay */}
									{isLoading && (
										<div className="absolute inset-0 bg-black/50 flex items-center justify-center animate-in fade-in duration-300">
											<div className="bg-white rounded-2xl p-6 text-center shadow-xl animate-in zoom-in duration-300">
												<div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
												<p className="text-gray-700 font-medium">{t.processing}</p>
											</div>
										</div>
									)}
								</div>
								
								{/* Selfie Controls */}
								<div className="mt-4 flex gap-3">
									<button 
										onClick={selfie ? retakeSelfie : captureSelfie}
										disabled={isLoading || (!cameraReady && !selfie)}
										className="group relative inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 transition-all duration-200"
									>
										<div className="relative">
											{selfie ? <RotateCcw className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
											{!selfie && cameraReady && (
												<div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-pulse"></div>
											)}
										</div>
										{selfie ? t.retakeSelfie : t.captureSelfie}
										<div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
									</button>
								</div>
								
								{/* Camera Error */}
								{cameraError && (
									<div className="mt-4 animate-in slide-in-from-bottom duration-500">
										<div className="bg-red-50 border border-red-200 rounded-xl p-4">
											<p className="text-red-600 font-medium">{cameraError}</p>
										</div>
									</div>
								)}
							</div>

							{/* Aadhaar Section */}
							<div className="animate-in slide-in-from-right duration-700 delay-300">
								<div className="flex items-center gap-2 mb-4">
									<IdCard className="w-5 h-5 text-green-600" />
									<h3 className="text-xl font-bold text-gray-800">{t.aadhaar}</h3>
								</div>
								
								<label 
									className={`block border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 ${
										isDragOver 
											? 'border-green-500 bg-green-50 scale-105' 
											: aadhar 
												? 'border-green-400 bg-green-50' 
												: 'border-gray-300 hover:border-green-400 hover:bg-green-50'
									}`}
									onDragOver={handleDragOver}
									onDragLeave={handleDragLeave}
									onDrop={handleDrop}
								>
									<input 
										type="file" 
										accept="image/*" 
										onChange={onAadharUpload} 
										className="hidden" 
									/>
									<div className="flex flex-col items-center gap-4">
										<div className={`relative transition-all duration-300 ${isDragOver ? 'scale-110' : ''}`}>
											<div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl grid place-items-center">
												<Upload className="w-8 h-8 text-green-600" />
											</div>
											{uploadSuccess && (
												<div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full grid place-items-center animate-in zoom-in duration-300">
													<CheckCircle className="w-4 h-4 text-white" />
												</div>
											)}
										</div>
										<div>
											<p className="font-bold text-gray-800 mb-1">{t.dropFiles}</p>
											<p className="text-sm text-gray-500">{t.fileSupport}</p>
										</div>
									</div>
								</label>
								
								{/* Uploaded Image Preview */}
								{aadhar && (
									<div className="mt-4 bg-gradient-to-br from-gray-50 to-white p-4 rounded-2xl border border-gray-200 shadow-inner animate-in slide-in-from-bottom duration-500">
										<div className="relative">
											<img src={aadhar} alt="Aadhaar" className="max-h-64 w-full mx-auto rounded-xl object-contain shadow-md" />
											{uploadSuccess && (
												<div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-in slide-in-from-top">
													{t.uploaded}
												</div>
											)}
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Footer Section */}
						<div className="mt-12 pt-8 border-t border-gray-200 animate-in slide-in-from-bottom duration-700 delay-500">
							<div className="flex flex-col sm:flex-row items-center justify-between gap-6">
								{/* Continue Button */}
								<button 
									onClick={completeSignup} 
									disabled={!selfie || !aadhar || isLoading}
									className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-700 text-white font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 transition-all duration-200"
								>
									<ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
									{t.continue}
									<div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
								</button>

								{/* Login Link */}
								<p className="text-gray-600">
									{t.loginQ}{' '}
									<Link 
										href="/login" 
										className="text-green-600 font-bold hover:text-green-700 transition-colors duration-200 relative group"
									>
										{t.loginNow}
										<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
									</Link>
								</p>
							</div>
						</div>
					</div>
				</div>

				<canvas ref={selfieCanvasRef} className="hidden" />
			</main>
		</div>
	);
}