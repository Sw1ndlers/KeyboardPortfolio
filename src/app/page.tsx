"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { GLTF, GLTFLoader } from "three/examples/jsm/Addons.js";
import { Html, OrbitControls } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";
// import { Tween } from "three/examples/jsm/libs/tween.module.js";
import * as THREE from "three";
import { useEffect, useState } from "react";

function PointCamera({ gltf }: { gltf: GLTF }) {
	const { camera } = useThree();
	const screen = gltf.scene.getObjectByName("Screen_1")!;

	let lookAt = null;

	if (screen) {
		lookAt = screen.position.clone();
		lookAt.y += 3;
	}

	useFrame(() => {
		if (lookAt) {
			camera.lookAt(lookAt);
		}
	});

	return <></>;
}

function HtmlRenderer({ gltf }: { gltf: GLTF }) {
	const screen = gltf.scene.getObjectByName("Screen_1")!;

	let bboxSize = null;
	let position = null;

	if (screen) {
		const bbox = new THREE.Box3().setFromObject(screen);
		bboxSize = new THREE.Vector3();
		bbox.getSize(bboxSize);

		position = screen.getWorldPosition(new THREE.Vector3());
		position.x += 0.1;
	}

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

function KeyboardModel() {
	const gltf = useLoader(GLTFLoader, "Keyboard v2.glb");

	return (
		<>
			<primitive object={gltf.scene} />

			<PointCamera gltf={gltf} />
			<HtmlRenderer gltf={gltf} />
            <KeyReactivity glft={gltf}/>
		</>
	);
}

const keyOrder = "Tab Q W E R T Y U I O P [{ }] \| Caps A S D F G H J K L ;: '\" Enter LShift Z X C V B N M ,< .> /? up RShift LCtrl Win LAlt Fn Space RAlt left down right RCtrl".split(" ")

type KeyArray = {[letter: string]: [THREE.Mesh, THREE.Mesh]}
type KeyCap = THREE.Mesh
type KeyText = THREE.Mesh

function KeyReactivity({glft}: {glft: GLTF}) {
    const [finalizedKeys, setFinalizedKeys] = useState<KeyArray>({})

    useEffect(() => {
        if (!finalizedKeys) return

        window.onkeydown = (e) => {
            console.log(e.key)
            const key = finalizedKeys[e.key] || finalizedKeys[e.key.toLowerCase()] || finalizedKeys[e.key.toUpperCase()]

            if (key) {
                const [keyCap, keyText] = key

                keyCap.material = new THREE.MeshStandardMaterial({color: 0x000000})
                keyText.material = new THREE.MeshStandardMaterial({color: 0xffffff})
            } else {
                if (e.key == "Control") {
                    const key = e.location == 1 ? finalizedKeys["LCtrl"] : finalizedKeys["RCtrl"]
                    const [keyCap, keyText] = key

                    keyCap.material = new THREE.MeshStandardMaterial({color: 0x000000})
                    keyText.material = new THREE.MeshStandardMaterial({color: 0xffffff})
                }

                if (e.key == "Shift") {
                    const key = e.location == 1 ? finalizedKeys["LShift"] : finalizedKeys["RShift"]
                    const [keyCap, keyText] = key

                    keyCap.material = new THREE.MeshStandardMaterial({color: 0x000000})
                    keyText.material = new THREE.MeshStandardMaterial({color: 0xffffff})
                }

                if (e.key == "Alt") {
                    const key = e.location == 1 ? finalizedKeys["LAlt"] : finalizedKeys["RAlt"]
                    const [keyCap, keyText] = key

                    keyCap.material = new THREE.MeshStandardMaterial({color: 0x000000})
                    keyText.material = new THREE.MeshStandardMaterial({color: 0xffffff})
                }
            }
        }

    }, [finalizedKeys])


    useEffect(() => {
        const keys: KeyArray = {}
        const children: {[name: string]: THREE.Mesh} = {}

        glft.scene.traverse(child => {
            if (child instanceof THREE.Mesh) {
                // if (!child.name.startsWith("Key") || !child.name.startsWith("Text")) return

                children[child.name] = child
            }
        })

        // for i in range 1-50
        keyOrder.forEach((letter, i) => {
            const index = i + 1

            const keyCap = children[`Key${index}`] as KeyCap
            const keyText = children[`Text${index}`] as KeyText

            if (keyCap && keyText) {
                keys[letter] = [keyCap, keyText]
            } else {
                switch (index) {
                    case 39:
                        keys["ArrowLeft"] = [keyCap, children["LeftArrow"]]
                        break
                    case 42:
                        keys["Windows"] = [keyCap, children["WindowsIcon"]]
                        break
                    case 46:
                        keys["ArrowDown"] = [keyCap, children["DownArrow"]]
                        break
                    case 47:
                        keys["ArrowUp"] = [keyCap, children["UpArrow"]]
                        break
                    case 48:
                        keys["ArrowRight"] = [keyCap, children["RightArrow"]]
                        break
                }
            }
        })

        setFinalizedKeys(keys)
    }, [])
    

    return (<></>)
}

export default function Home() {
	return (
		<div className=" w-screen h-screen">
			<Canvas
				camera={{
					position: [4.5, 3.15, 0],
				}}
			>
				<pointLight position={[0, 5, 0]} intensity={120} />
				{/* <primitive object={gltf.scene} /> */}
				<KeyboardModel />

				<OrbitControls />
			</Canvas>
		</div>
	);
}
