import './style.css'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { Camera } from 'three'

/**
 * Base
 */
// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const box = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
);

scene.add(box)


/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();
let currentIntersect = null;


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
* Post processing
*/
// Effect composer
const effectComposer = new EffectComposer(renderer);
effectComposer.setSize(sizes.width, sizes.height)
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
console.log(effectComposer)

// Render pass
const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass);

// Glitch pass
const glitchPass = new GlitchPass();
// effectComposer.addPass(glitchPass)

// Outline pass
let outlinePass;


outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );
effectComposer.addPass( outlinePass );

outlinePass.visibleEdgeColor = new THREE.Color('yellow')
outlinePass.edgeGlow = 4;

/**
 * Window resize
 */
window.addEventListener('resize', ()=> 
{
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

/**
 * Mouse Event
 */
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (e) => 
{
    mouse.x = (e.clientX / sizes.width) * 2 - 1;
    mouse.y = (e.clientY / sizes.height) * 2 - 1;
});

/**
 * Mouse Click
 */
window.addEventListener('click', ()=> 
{
    console.log('clicked')
    box.material.color = new THREE.Color('pink')

});

/**
 * Animate
 */
const tick = () =>
{
    // Cast a ray from camera to handle mouse clicks
    raycaster.setFromCamera(mouse, camera);

    // Render
    // renderer.render(scene, camera);
    effectComposer.render();

    // Call tick again on next frame
    window.requestAnimationFrame(tick);
}

tick();