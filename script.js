const video = document.getElementById('video');
const resultCard = document.getElementById('result-card');
const emojiIcon = document.getElementById('emoji-icon');
const emotionLabel = document.getElementById('emotion-label');

// 1. โหลด AI Model (Tiny Face Detector สำหรับความเร็วบนมือถือ)
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights'),
    faceapi.nets.faceExpressionNet.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights')
]).then(startCamera);

function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: {} })
        .then(stream => {
            video.srcObject = stream;
            document.getElementById('loading').style.display = 'none';
            resultCard.classList.remove('hidden');
        });
}

video.addEventListener('play', () => {
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, 
            new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();

        if (detections.length > 0) {
            // ดึงอารมณ์ที่มีคะแนนสูงสุดออกมา
            const expressions = detections[0].expressions;
            const sorted = Object.entries(expressions).sort((a, b) => b[1] - a[1]);
            const mainEmotion = sorted[0][0];

            updateDisplay(mainEmotion);
        }
    }, 500); // ตรวจจับทุกๆ 0.5 วินาที
});

function updateDisplay(emotion) {
    const feelings = {
        happy: { text: "วันนี้มีความสุขมากเลย!", emoji: "😆" },
        neutral: { text: "ปกติจ้า พร้อมเรียน!", emoji: "😐" },
        sad: { text: "โอ๋ๆ ไม่เป็นไรนะ สู้ๆ", emoji: "🥺" },
        angry: { text: "ใจเย็นๆ นะจ๊ะคนเก่ง", emoji: "😡" },
        surprised: { text: "ว้าว! ตื่นเต้นอะไรนะ", emoji: "😲" }
    };

    const result = feelings[emotion] || feelings.neutral;
    emotionLabel.innerText = result.text;
    emojiIcon.innerText = result.emoji;
}