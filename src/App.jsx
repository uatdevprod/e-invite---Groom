import { AnimatePresence, motion as Motion } from "framer-motion";
import { MessageCircleHeart, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import LiveBackground from "./components/LiveBackground";
import gu from "./data/gujarati.json";

const slideUp = {
	hidden: { opacity: 0, y: 40, scale: 0.95 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: { duration: 0.6, ease: "easeOut" },
	},
};

// --- Image Carousel Component ---
const ImageCarousel = () => {
	const images = ["/couple1.jpeg", "/couple2.jpeg", "/couple.jpeg"];
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setIndex((prev) => (prev + 1) % images.length);
		}, 9000);
		return () => clearInterval(timer);
	}, [images.length]);

	return (
		<div className="relative w-full h-64 md:h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 mb-6 bg-white/20 backdrop-blur-md">
			<AnimatePresence mode="wait">
				<Motion.img
					key={index}
					src={images[index]}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 1 }}
					loading="lazy"
					decoding="async"
					className="absolute inset-0 w-full h-full object-cover"
				/>
			</AnimatePresence>
			<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
				{images.map((_, i) => (
					<div
						key={i}
						className={`w-1.5 h-1.5 rounded-full transition-all ${i === index ? "bg-rosegold w-4" : "bg-white/50"}`}
					/>
				))}
			</div>
		</div>
	);
};

const FallingPetals = () => {
	const [petals] = useState(() => {
		return Array.from({ length: 25 }).map(() => ({
			left: Math.random() * 100,
			delay: Math.random() * 10,
			duration: 10 + Math.random() * 10,
			size: 10 + Math.random() * 15,
		}));
	});

	return (
		<div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
			{petals.map((petal, i) => (
				<Motion.div
					key={i}
					initial={{ top: -50, left: `${petal.left}vw`, opacity: 0, rotate: 0 }}
					animate={{
						top: "110vh",
						left: [
							`${petal.left}vw`,
							`${petal.left + 5}vw`,
							`${petal.left - 5}vw`,
							`${petal.left}vw`,
						],
						opacity: [0, 0.7, 0.7, 0],
						rotate: 360,
					}}
					transition={{
						duration: petal.duration,
						repeat: Infinity,
						delay: petal.delay,
						ease: "linear",
					}}
					className="absolute bg-rosegold/40 backdrop-blur-sm"
					style={{
						width: petal.size,
						height: petal.size,
						borderTopLeftRadius: "50%",
						borderBottomRightRadius: "50%",
						borderTopRightRadius: "5%",
						borderBottomLeftRadius: "5%",
					}}
				/>
			))}
		</div>
	);
};

function App() {
	const [language, setLanguage] = useState("gu");
	const [isOpened, setIsOpened] = useState(false);
	const [isPlaying, setIsPlaying] = useState(true);

	const content = language === "gu" ? gu : " ";
	const audioRef = useRef(null);

	// --- Safely Extracting New JSON Structure ---
	const invitations = content?.invitation_details || {};
	const invocations = invitations.spiritual_invocations || [];
	const quote = invitations.inspirational_quote || "";
	const bride = content?.couple?.bride || {};
	const groom = content?.couple?.groom || {};
	const event = content?.event_details || {};
	const family = content?.family_and_well_wishers || {};
	const contact = content?.contact_information || {};

	const isLowEnd = navigator.hardwareConcurrency <= 4;
	const handleOpenInvitation = () => {
		setIsOpened(true);
		if (audioRef.current) {
			audioRef.current.currentTime = 8;
			audioRef.current.volume = 0.6;
			audioRef.current
				.play()
				.catch((e) => console.log("Audio autoplay prevented", e));
			setIsPlaying(true);
		}
	};

	const toggleAudio = () => {
		if (isPlaying) audioRef.current.pause();
		else audioRef.current.play();
		setIsPlaying(!isPlaying);
	};

	// --- SCENE 1: The Initial Entry Box ---
	if (!isOpened) {
		return (
			<div className="h-dvh w-full bg-[#FAF9F6] flex flex-col items-center justify-center font-serif relative overflow-hidden p-6 text-center">
				<LiveBackground />
				{!isLowEnd && <FallingPetals />}
				<Motion.div
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					onClick={handleOpenInvitation}
					className="relative z-10 w-full max-w-sm cursor-pointer group bg-white/30 p-10 rounded-2xl border-2 border-white shadow-2xl">
					<div className="relative w-32 h-32 mx-auto mb-8">
						<img
							src="/RA-logo.png"
							alt="Logo"
							className="w-full h-full rounded-full shadow-lg border-4 border-white relative z-10 object-cover"
						/>
					</div>
					<h2 className="font-cursive text-5xl text-rosegold mb-4">
						{groom.name} & {bride.name}
					</h2>
					<p className="text-rosegold/80 tracking-widest text-xs uppercase animate-pulse font-semibold">
						Tap to Enter
					</p>
				</Motion.div>
				<audio ref={audioRef} src="/kabira.mp3" loop />
			</div>
		);
	}

	// --- SCENE 2: The Reels Experience ---
	return (
		<div className="h-dvh w-full font-serif text-gray-800 relative bg-transparent">
			<LiveBackground />
			{!isLowEnd && <FallingPetals />}
			<audio ref={audioRef} src="/kabira.mp3" loop autoPlay />

			{/* --- Floating UI Elements --- */}
			<div className="fixed z-50 top-6 left-4 right-4 flex justify-between items-center pointer-events-none">
				<button
					onClick={toggleAudio}
					className="pointer-events-auto bg-white/50 backdrop-blur-md p-3 rounded-full text-rosegold shadow-sm border border-white/40">
					{isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
				</button>

				<button
					onClick={() => setLanguage(language === "gu")}
					className="pointer-events-auto flex items-center gap-1 text-xs tracking-widest uppercase text-rosegold bg-white/50 backdrop-blur-md px-2 py-2 rounded-full shadow-sm border border-white/40 font-bold">
					<span className={language === "gu" ? "" : "text-gray-500"}>
						ગુજરાતી
					</span>
				</button>
			</div>

			<a
				href={`https://wa.me/919323944934?text=Hello!%20We%20will%20be%20attending%20the%20wedding!`}
				target="_blank"
				rel="noreferrer"
				className="fixed z-50 bottom-6 right-4 bg-green-500/90 backdrop-blur-md text-white p-4 rounded-full shadow-lg flex items-center gap-2 hover:bg-green-600 transition border border-green-400/50">
				<MessageCircleHeart size={24} />
			</a>

			{/* --- Scroll Snap Container --- */}
			<div className="h-dvh w-full overflow-y-auto snap-y no-scrollbar relative z-10">
				{/* Slide 1: Hero */}
				<section className="h-dvh w-full snap-start flex flex-col items-center justify-center p-6 text-center">
					<Motion.div
						variants={slideUp}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.2 }}
						className="max-w-sm">
						<div className="text-rosegold/80 text-xs font-medium space-y-1 mb-8">
							{invocations.map((inv, i) => (
								<p key={i}>{inv}</p>
							))}
						</div>

						<img
							src="/RA-logo.png"
							className="w-32 h-32 mx-auto mb-2 rounded-full shadow-lg border-4 border-white/50 object-cover"
						/>

						<h1 className="font-cursive text-6xl md:text-7xl text-rosegold leading-tight mb-4">
							{groom.name} & {bride.name}
						</h1>

						<div className="bg-white/50 backdrop-blur-md p-3 rounded-xl border border-white/40 inline-block">
							<h3 className="text-sm font-bold text-gray-800">{event.date}</h3>
							<h4 className="text-xs text-rosegold font-semibold mt-1">
								{event.hindu_calendar_date}
							</h4>
						</div>
						{quote && (
							<p className="text-[11px] text-gray-600 italic leading-relaxed bg-white/80 p-4 rounded-xl border border-white/30 text-center mt-2">
								"{quote}"
							</p>
						)}
					</Motion.div>
				</section>

				{/* Slide 2: Carousel & Quote */}
				<section className="h-dvh w-full snap-start flex flex-col items-center justify-center p-6">
					<Motion.div
						variants={slideUp}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.2 }}
						className="w-full max-w-sm">
						<Motion.div
							variants={slideUp}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, amount: 0.2 }}
							className="w-full max-w-sm bg-white/60 p-6 rounded-3xl border border-white/50 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar text-center mb-2">
							<div>
								<h4 className="text-rosegold mb-3 italic font-bold uppercase tracking-widest text-[20px]">
									{groom.family_details?.name}
								</h4>
								<p className="text-rosegold text-xs font-medium mt-1">
									{groom.family_details?.native_village}
								</p>
								<p className="text-gray-800 font-bold text-sm">
									{groom.family_details?.parents}
								</p>
								<p className="text-gray-800 font-bold text-sm mt-1">
									{groom.family_details?.paternal_grandparents}
								</p>
							</div>
						</Motion.div>
						<ImageCarousel />
						<Motion.div
							variants={slideUp}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, amount: 0.2 }}
							className="w-full max-w-sm bg-white/60 p-6 rounded-3xl border border-white/50 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar text-center">
							<div>
								<h4 className="text-rosegold mb-3 italic font-bold uppercase tracking-widest text-[20px]">
									{bride.family_details?.name}
								</h4>
								<p className="text-rosegold text-xs font-medium mt-1">
									{bride.family_details?.native_village}
								</p>
								<p className="text-gray-800 font-bold text-sm">
									{bride.family_details?.parents}
								</p>
								<p className="text-gray-800 font-bold text-sm mt-1">
									{bride.family_details?.paternal_grandmother}
								</p>
							</div>
						</Motion.div>
					</Motion.div>
				</section>

				{/* Slide 3: Events */}
				<section className="h-dvh w-full snap-start flex flex-col items-center justify-center p-6">
					<Motion.div
						variants={slideUp}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.2 }}
						className="w-full max-w-sm bg-white/60 backdrop-blur-sm p-8 rounded-3xl border border-white/50 shadow-xl">
						<h2 className="text-center text-sm tracking-widest uppercase text-rosegold border-b border-rosegold/20 pb-3 mb-4 font-bold">
							પ્રસંગ
						</h2>

						<div className="space-y-6">
							{event.schedule?.map((evt, i) => (
								<div
									key={i}
									className="flex flex-col border-b border-dashed border-rosegold/20 pb-3 last:border-0">
									<div className="flex justify-between items-center">
										<span className="font-bold text-gray-800">{evt.event}</span>
										<span className="text-rosegold font-bold text-sm">
											{evt.time}
										</span>
									</div>
									{evt.notes && (
										<span className="text-[10px] text-gray-500 mt-1">
											{evt.notes}
										</span>
									)}
								</div>
							))}
						</div>
					</Motion.div>
				</section>

				{/* Slide 4: Darshanabhilashi & Well Wishers */}
				<section className="h-dvh w-full snap-start flex flex-col items-center justify-center p-6 text-center">
					<Motion.div
						variants={slideUp}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.2 }}
						className="w-full max-w-sm bg-white/60 p-6 rounded-3xl border border-white/50 shadow-2xl max-h-[85vh] overflow-y-auto no-scrollbar">
						<h4 className="text-rosegold mb-4 italic font-bold uppercase tracking-widest text-sm border-b border-rosegold/20 pb-2 inline-block px-4">
							{family.darshanabhilashi_section?.title}
						</h4>

						<Motion.div
							variants={{
								visible: { transition: { staggerChildren: 0.1 } },
							}}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true }}
							className="flex flex-col gap-2.5">
							{family.darshanabhilashi_section?.members.map((member, i) => (
								<Motion.div
									key={i}
									variants={{
										hidden: { opacity: 0, y: 15 },
										visible: {
											opacity: 1,
											y: 0,
											transition: { duration: 0.4, ease: "easeOut" },
										},
									}}
									className="relative overflow-hidden bg-gradient-to-r from-white/30 via-white/60 to-white/30 py-2.5 px-2 rounded-xl border border-white/60 shadow-sm flex items-center justify-center group hover:bg-white/80 hover:scale-[1.02] transition-all duration-300">
									<div className="absolute left-0 top-0 bottom-0 w-1 bg-rosegold/40 rounded-l-xl group-hover:bg-rosegold transition-colors"></div>
									<div className="absolute right-0 top-0 bottom-0 w-1 bg-rosegold/40 rounded-r-xl group-hover:bg-rosegold transition-colors"></div>

									<p className="text-[12px] leading-tight text-center flex items-center gap-x-1.5 font-bold text-gray-800">
										<span className="text-rosegold/60 text-[9px]">✦</span>
										{member}
										<span className="text-rosegold/60 text-[9px]">✦</span>
									</p>
								</Motion.div>
							))}
						</Motion.div>
					</Motion.div>
				</section>

				{/* Slide 5: Mameru & Well Wishers */}
				<section className="h-dvh w-full snap-start flex flex-col items-center justify-center p-6 text-center">
					<Motion.div
						variants={slideUp}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.2 }}
						className="w-full max-w-sm bg-white/50 p-6 rounded-3xl border border-white/50 shadow-2xl max-h-[85vh] overflow-y-auto no-scrollbar">
						<h4 className="text-rosegold mb-3 italic font-bold uppercase tracking-widest text-sm">
							સ્નેહાધીન
						</h4>
						<div className="text-gray-600 text-[10px] font-medium space-y-1">
							{family.snehaadhin_well_wishers?.map((n, i) => (
								<p key={i}>{n}</p>
							))}
						</div>
						<div className="w-12 h-px bg-rosegold/30 mx-auto m-4"></div>
						<h4 className="text-rosegold mb-2 italic font-bold uppercase tracking-widest text-sm">
							મામેરું
						</h4>
						<p className="text-rosegold font-bold text-xs">
							{family.maternal_relations_mameru?.village}
						</p>
						<p className="text-gray-800 font-semibold text-xs mb-3">
							{family.maternal_relations_mameru?.grandparents}
						</p>

						{/* Safe mapping using the ? operator */}
						<Motion.div
							variants={{
								visible: { transition: { staggerChildren: 0.1 } },
							}}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true }}
							className="flex flex-col gap-2 mb-4">
							{family.maternal_relations_mameru?.uncles_and_aunts?.map(
								(aunt, i) => (
									<Motion.div
										key={i}
										variants={{
											hidden: { opacity: 0, y: 15 },
											visible: {
												opacity: 1,
												y: 0,
												transition: { duration: 0.4, ease: "easeOut" },
											},
										}}
										className="relative overflow-hidden bg-white/40 py-2 px-2 rounded-xl border border-white/60 shadow-sm text-gray-800 text-[11px] font-semibold">
										{aunt}
									</Motion.div>
								),
							)}
						</Motion.div>

						<div className="flex flex-col gap-1.5 mb-6">
							{family.maternal_relations_mameru?.siblings_cousins?.map(
								(cousin, i) => (
									<p key={i} className="text-gray-500 text-[10px] font-medium">
										{cousin}
									</p>
								),
							)}
						</div>
					</Motion.div>
				</section>

				{/* Slide 6 : Map & Contact */}
				<section className="h-dvh w-full snap-start flex flex-col items-center justify-center p-6 text-center">
					<Motion.div
						variants={slideUp}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.2 }}
						className="w-full max-w-sm">
						<div className="bg-white/60  p-6 rounded-3xl shadow-xl border border-white/50 mb-6">
							<h2 className="text-sm tracking-widest uppercase text-rosegold mb-1 font-bold">
								સ્થળ
							</h2>
							<p className="font-bold text-gray-800 text-lg">
								{event.venue?.name}
							</p>
							<p className="text-gray-700 text-[10px] leading-tight mb-2">
								{event.venue?.address}
							</p>
							<p className="font-bold text-rosegold text-sm">{contact.phone}</p>
						</div>
						<div className="w-full h-48 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/60">
							<iframe
								src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15076.392055762308!2d72.83680582487656!3d19.147186452496317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b7005a8fb41f%3A0xf416abb0aaf0df4f!2sAurum%20baquet%20Nesco!5e0!3m2!1sen!2sin!4v1776059272027!5m2!1sen!2sin"
								width="100%"
								height="100%"
								style={{ border: 0 }}
								allowfullscreen=""
								loading="lazy"></iframe>
						</div>
						<p className="text-rosegold font-cursive text-5xl mt-8">
							See you there!
						</p>
					</Motion.div>
				</section>
			</div>
		</div>
	);
}

export default App;
