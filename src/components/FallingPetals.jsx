import { motion as Motion } from "framer-motion";
import { useState } from "react";

const FallingPetals = () => {
	// Lazy initialization: We pass a function into useState so it only calculates this once on the very first load.
	// No useEffect needed!
	const [petals] = useState(() => {
		return Array.from({ length: 25 }).map(() => ({
			left: Math.random() * 100, // random start X position (vw)
			delay: Math.random() * 10, // random start delay
			duration: 10 + Math.random() * 10, // random fall speed (10-20s)
			size: 10 + Math.random() * 15, // random size
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

export default FallingPetals;
