"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import * as THREE from "three";
import { Html, OrbitControls } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";

function OnMount() {
	const state = useThree();
	const { camera, scene } = state;

	const screen = scene.getObjectByName("Screen_1")!;
	let lookAt = null;

	let bboxSize = null;
	let position = null;

	if (screen) {
		lookAt = screen.position.clone();
		lookAt.y += 3;

		console.log(screen.scale);

		const bbox = new THREE.Box3().setFromObject(screen);
		bboxSize = new THREE.Vector3();
		bbox.getSize(bboxSize);

		position = screen.getWorldPosition(new THREE.Vector3());
		position.x += 0.1;
	}

	useFrame(() => {
		if (lookAt) {
			camera.lookAt(lookAt);
		}
	});

	return (
		<>
			{screen && (
				<mesh position={position!}>
					<Html
						transform
						rotation={[0, degToRad(90), 0]}
						occlude="raycast"
					>
						<div className="w-[658px] h-[347px] text-red-500 select-none flex justify-center items-center">
							<p className=" text-5xl">Hi im Alex</p>
						</div>
					</Html>
				</mesh>
			)}
		</>
	);
}

export default function Home() {
	const gltf = useLoader(GLTFLoader, "Keyboard v2.glb");

	return (
		<div className=" w-screen h-screen">
			<Canvas
				camera={{
					position: [4.5, 3.15, 0],
				}}
			>
				<pointLight position={[0, 5, 0]} intensity={120} />
				<primitive object={gltf.scene} />
				<OrbitControls />

				<OnMount />
			</Canvas>
		</div>
	);
}
