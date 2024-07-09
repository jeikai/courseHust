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

        // Extract the file name from the URL
        const videoUrl = new URL(data.video);
        const videoName = path.basename(videoUrl.pathname, path.extname(videoUrl.pathname)); 
        const outputFileName = `${videoName}.m3u8`;
        const outputFilePath = path.join(videoFolder, outputFileName);

        // Check if a folder with the name of videoName exists
        if (fs.existsSync(path.join(videoFolder, videoName))) {
            return res.json({ message: 'Folder already exists', videoPath: `/videos/${videoName}/${outputFileName}` });
        }

        // Create a new folder with the name of videoName
        const newFolderPath = path.join(videoFolder, videoName);
        fs.mkdirSync(newFolderPath, { recursive: true });

        // Define the output file path within the new folder
        const finalOutputFilePath = path.join(newFolderPath, outputFileName);

        const command = `ffmpeg -i ${data.video} -codec: copy -f hls -hls_list_size 0 -hls_segment_type mpegts ${finalOutputFilePath}`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return res.status(500).json({ message: 'Error converting video' });
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
            }
            console.log(`Stdout: ${stdout}`);
            return res.json({ videoPath: `/videos/${videoName}/${outputFileName}` });
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: e.message });
    }
};
