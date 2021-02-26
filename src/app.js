import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from 'react-three-fiber'
import { Html, OrbitControls } from '@react-three/drei'
import './styles.css'

function Box(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef()

  const [active, setActive] = useState(false)

  // Rotate mesh every frame, this is outside of React without overhead
  let direction = 0.01
  useFrame(() => {
    if (mesh.current.position.x > 1) {
      direction = -0.01
    } else if (mesh.current.position.x < -1) {
      direction = 0.01
    }
    if (props.move) {
      mesh.current.rotation.y = mesh.current.rotation.y += 0.01
      mesh.current.position.x = mesh.current.position.x + direction
    }
  })

  return (
    <mesh {...props} ref={mesh} scale={props.scale || [2, 0.5, 2]} onClick={(e) => setActive(!active)}>
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={props.color} metalness={0.2} />
    </mesh>
  )
}

export default function App() {
  const colors = ['#173f5f', '#20639b', '#3caea3', '#f6d55c', '#ed553b']
  const [boxes, setBoxes] = useState([])

  return (
    <Canvas
      onClick={() => generateNewBlock()}
      camera={{ position: [0, 7, 7], near: 5, far: 15 }}
      onCreated={({ gl }) => gl.setClearColor('lightpink')}>
      <ambientLight intensity={0.5} />
      <pointLight position={[150, 150, 150]} intensity={0.55} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      {boxes.map((props) => (
        <Box {...props} />
      ))}
      <Box position={[0, -3.5, 0]} scale={[3, 0.5, 3]} color="hotpink" />
      <Html scaleFactor={15} class="main">
        <div class="content">{`Score: ${boxes.length}`}</div>
      </Html>
      <OrbitControls />
    </Canvas>
  )

  function generateNewBlock() {
    const total = boxes.length
    const color = colors[getRandomInt(6)]
    let newBoxes = boxes.map((props) => ({ ...props, move: false }))
    newBoxes.push({ position: [getRandomInt(3), total * 0.5 - 3, 0], color: color, move: true })
    setBoxes([...newBoxes])
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max))
  }
}
