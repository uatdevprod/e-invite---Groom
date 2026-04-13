import { motion as Motion } from "framer-motion";
import FallingPetals from "./FallingPetals";

const LiveBackground = () => {
	return (
		<>
			<div className="fixed inset-0 -z-10 overflow-hidden bg-[#FAF9F6]">
				<Motion.div
					animate={{ x: [0, 30, -20, 0], y: [0, 40, -40, 0] }}
					transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
					className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-rosegold/20 rounded-full blur-[80px]"
				/>
				<Motion.div
					animate={{ x: [0, -50, 30, 0], y: [0, 60, -20, 0] }}
					transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
					className="absolute top-1/3 -right-20 w-[300px] h-[300px] bg-[#e6c998]/30 rounded-full blur-[80px]"
				/>
				<Motion.div
					animate={{ x: [0, 40, -40, 0], y: [0, -50, 50, 0] }}
					transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
					className="absolute -bottom-20 left-1/4 w-[400px] h-[400px] bg-blush/40 rounded-full blur-[80px]"
				/>
				<FallingPetals />
			</div>
		</>
	);
};

export default LiveBackground;
