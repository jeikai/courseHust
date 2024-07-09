const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

// Update the video folder path
const videoFolder = path.join('D:', 'CodeThue', 'courseHust', 'client', 'videos');

exports.convert = async function (req, res) {
    try {
        const data = req.body;

        if (!data.video) {
            return res.status(400).json({ message: 'Video URL is required' });
        }

        // Generate a proxy URL
        const videoUrl = new URL(data.video);
        const videoName = path.basename(videoUrl.pathname, path.extname(videoUrl.pathname));
        const proxiedVideoPath = `/api/proxy/${videoName}`;

        // Return the proxied video URL
        return res.json({ videoPath: proxiedVideoPath });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: e.message });
    }
};
