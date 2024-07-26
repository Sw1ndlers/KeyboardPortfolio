"use client";

import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { useEffect } from "react";

const keyboardString = "qwertyuiop asdfghjkl zxcvbnm";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

function setupScene(onModelLoad: (importedModel: THREE.Object3D) => void) {
	const loader = new GLTFLoader();

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000,
	);

	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	scene.background = new THREE.Color("rgb(36, 36, 36)");
	camera.position.x = 4;
	camera.position.y = 3.8;

	loader.load(
		"Keyboard v2.glb",
		function (gltf) {
			scene.add(gltf.scene);

			onModelLoad(gltf.scene);
		},
		function (progress) {
			// console.log(progress);
		},
		function (error) {
			console.error(error);
		},
	);

    // const controls = new OrbitControls(camera, renderer.domElement);

	function animate() {
        // controls.update();
		renderer.render(scene, camera);
	}
	renderer.setAnimationLoop(animate);

	return { scene, camera, renderer };
}

export default function Home() {
	useEffect(() => {
		const { scene, camera, renderer } = setupScene(onModelLoad);

		const light = new THREE.PointLight(0xffffff);
		scene.add(light);

		light.position.set(0, 5, 0);
		light.intensity = 30;
        

		function onModelLoad(importedModel: THREE.Object3D) {
			const lookAt = importedModel.position.clone();
			lookAt.y += 3.4;

			const keys: THREE.Mesh[] = [];

			camera.lookAt(lookAt);
			importedModel.traverse((child) => {
				if (child instanceof THREE.Mesh) {
					if (
						child.name.includes("Key") &&
						child.name.includes("Back") == false
					) {
						keys.push(child);
					}
				}
			});

			// sort keys by name (Key1, Key2, Key3, ...)
			keys.sort((a, b) => {
				const aNum = parseInt(a.name.replace(/^\D+/g, ""));
				const bNum = parseInt(b.name.replace(/^\D+/g, ""));
				return aNum - bNum;
			});
		}

		function onResize() {
			renderer.setSize(window.innerWidth, window.innerHeight);
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
		}

		window.onresize = onResize;

		return () => {
			renderer.domElement.remove();
			window.onresize = null;
			renderer.setAnimationLoop(null);
		};
	}, []);

	return <></>;
}
