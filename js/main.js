console.log('Script executing...');

// Wait for the page to load
window.onload = function() {
    console.log('Window loaded');
    
    try {
        // Create scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x333333);
        
        // Create camera
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 10;
        
        // Create renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('container').appendChild(renderer.domElement);
        
        // Add a simple cube to verify rendering works
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        // Now this should work as THREE.OrbitControls
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        
        // Now this should work as THREE.GLTFLoader
        const loader = new THREE.GLTFLoader();
        const modelPath = './models/MocapMan.gltf';
        
        loader.load(
            modelPath,
            function(gltf) {
                console.log('Model loaded successfully!');
                document.getElementById('loadingText').style.display = 'none';
                
                const model = gltf.scene;
                
                // Remove the cube when model is loaded
                scene.remove(cube);
                
                // Center and scale the model if needed
                model.scale.set(1, 1, 1); // Adjust as needed
                scene.add(model);
                
                // Auto-adjust camera to fit model
                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                
                const maxDim = Math.max(size.x, size.y, size.z);
                const fov = camera.fov * (Math.PI / 180);
                const cameraZ = Math.abs(maxDim / Math.sin(fov / 2)) * 1.5;
                
                camera.position.z = center.z + cameraZ;
                controls.target.set(center.x, center.y, center.z);
                controls.update();
            },
            function(xhr) {
                const percent = (xhr.loaded / xhr.total * 100).toFixed(0);
                console.log(percent + '% loaded');
                document.getElementById('loadingText').textContent = `Loading model: ${percent}%`;
            },
            function(error) {
                console.error('Error loading model:', error);
                document.getElementById('loadingText').textContent = 'Error loading model: ' + error.message;
            }
        );
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            // Update controls
            controls.update();
            
            // Rotate cube if it's still in the scene
            if (cube.parent === scene) {
                cube.rotation.x += 0.01;
                cube.rotation.y += 0.01;
            }
            
            renderer.render(scene, camera);
        }
        
        // Handle window resize
        window.addEventListener('resize', function() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        // Start animation
        animate();
        console.log('Animation started');
        
    } catch (error) {
        console.error('Error in Three.js setup:', error);
        document.getElementById('loadingText').textContent = 'Error setting up 3D viewer: ' + error.message;
    }
};