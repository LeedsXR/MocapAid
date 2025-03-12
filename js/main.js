console.log('Script executing...');

// Wait for the page to load
window.onload = function() {
    console.log('Window loaded');
    
    // Only initialize 3D viewer if we're on the marker placement page
    if (document.getElementById('marker-placement').classList.contains('active')) {
        initializeModelViewer();
    }
    
    // Add event listeners to initialize 3D viewer when navigating to marker placement
    document.querySelector('[data-page="marker-placement"]').addEventListener('click', function() {
        // Small delay to ensure the page is visible first
        setTimeout(initializeModelViewer, 100);
    });
    let romCurrentSlide = 0;
const romSlides = document.querySelectorAll('.rom-slide');

if (romSlides.length > 0) {
    document.querySelectorAll('.rom-slideshow-container .rom-prev').forEach(btn => {
        btn.addEventListener('click', function() {
            showROMSlide(romCurrentSlide - 1);
        });
    });

    document.querySelectorAll('.rom-slideshow-container .rom-next').forEach(btn => {
        btn.addEventListener('click', function() {
            showROMSlide(romCurrentSlide + 1);
        });
    });
}

// Update the showROMSlide function:

function showROMSlide(n) {
    if (romSlides.length === 0) return;
    
    // Reset current slides and titles
    romSlides.forEach(slide => slide.classList.remove('active'));
    document.querySelectorAll('.rom-slide-title').forEach(title => title.classList.remove('active'));
    
    // Handle index wrapping
    romCurrentSlide = n;
    if (romCurrentSlide >= romSlides.length) romCurrentSlide = 0;
    if (romCurrentSlide < 0) romCurrentSlide = romSlides.length - 1;
    
    // Show new slide and title
    romSlides[romCurrentSlide].classList.add('active');
    document.querySelector(`.rom-slide-title[data-slide="${romCurrentSlide}"]`).classList.add('active');
}

// Add click events to the slide titles
document.querySelectorAll('.rom-slide-title').forEach(title => {
    title.addEventListener('click', function() {
        const slideIndex = parseInt(this.getAttribute('data-slide'));
        showROMSlide(slideIndex);
    });
});
};

    function initializeModelViewer() {
    if (window.modelViewerInitialized) return;
    window.modelViewerInitialized = true;
    
    try {
        // Get the container
        const container = document.getElementById('container');
        if (!container) return;
        
        // Create scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x333333);
        
        // Get container dimensions
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const aspectRatio = containerWidth / containerHeight;
        
        // Create camera with correct aspect ratio
        const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
        camera.position.z = 10;
                
        // Create renderer with correct size
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(containerWidth, containerHeight);
        container.appendChild(renderer.domElement);
        
        // Add a simple cube to verify rendering works
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        
        // Add lights
        // Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Main directional light (from front-top-left)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Back light (from behind)
const backLight = new THREE.DirectionalLight(0xffffff, 0.7);
backLight.position.set(0, 1, -2); // Position it behind and slightly above
scene.add(backLight);

// Right side light (from character's right)
const rightSideLight = new THREE.DirectionalLight(0xffffff, 0.9);
rightSideLight.position.set(-2, 1, 0); // Position to the character's right (negative X)
scene.add(rightSideLight);

// Left side light (from character's left)
const leftSideLight = new THREE.DirectionalLight(0xffffff, 0.3); // Reduced from 0.8 to 0.5
leftSideLight.position.set(2, 1, 0); // Position to the character's left (positive X)
scene.add(leftSideLight);

        // Add orbit controls
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        
        // Load GLTF model
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
                
                // Add model to scene
                scene.add(model);
                
                // Calculate bounding box
                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                
                // Get the largest dimension of the model
                const maxDim = Math.max(size.x, size.y, size.z);
                const fov = camera.fov * (Math.PI / 180);
                const cameraZ = Math.abs(maxDim / Math.sin(fov / 2)) * 0.5;
                
                // Position camera slightly above and in front of the model to create downward view
                camera.position.set(
                    center.x,                   // Same X as center
                    center.y + (size.y * 0.4),  // Position camera above the center by 30% of model height
                    center.z + cameraZ          // Same Z distance as before
                );
                
                // Ensure camera's up vector is set correctly
                camera.up.set(0, 1, 0);
                
                // Point camera at model center (creates the downward angle)
                camera.lookAt(center);
                
                // Set orbit controls to rotate around model center
                controls.target.set(center.x, center.y, center.z);
                controls.update();
                
                
                console.log('Camera positioned for downward view at:', camera.position);
                console.log('Looking at center:', center);
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
            if (!container) return;
            
            // Get updated container dimensions
            const newWidth = container.clientWidth;
            const newHeight = container.clientHeight;
            
            // Update camera aspect ratio
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            
            // Update renderer size
            renderer.setSize(newWidth, newHeight);
        });
        
        // Start animation
        animate();
        console.log('Animation started');
        
    } catch (error) {
        console.error('Error in Three.js setup:', error);
        if (document.getElementById('loadingText')) {
            document.getElementById('loadingText').textContent = 'Error setting up 3D viewer: ' + error.message;
        }
    }
}

