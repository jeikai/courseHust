const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

// Update the video folder path
const videoFolder = path.join('D:', 'CodeThue', 'course_HUST', 'courseHust', 'client', 'videos');

exports.convert = async function (req, res) {
    try {
        const data = req.body;

        if (!data.video) {
            return res.status(400).json({ message: 'Video URL is required' });
        }

        // Generate a proxy URL
        const videoUrl = new URL(data.video);
        const videoName = path.basename(videoUrl.pathname, path.extname(videoUrl.pathname)); 
        const outputFileName = `${videoName}.mp4`;
        const outputFilePath = path.join(videoFolder, videoName, outputFileName);

        // Check if a folder with the name of videoName exists
        if (fs.existsSync(path.join(videoFolder, videoName))) {
            const fileContent = fs.readFileSync(outputFilePath);
            return res.json({ message: 'Folder already exists', videoContent: fileContent.toString('base64') });
        }

        // Create a new folder with the name of videoName
        const newFolderPath = path.join(videoFolder, videoName);
        fs.mkdirSync(newFolderPath, { recursive: true });

        // Define the output file path within the new folder
        const finalOutputFilePath = path.join(newFolderPath, outputFileName);

        // Encode the video from the URL to MP4 format
        const command = `ffmpeg -i "${data.video}" -vcodec libx264 -acodec aac ${finalOutputFilePath}`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return res.status(500).json({ message: 'Error converting video' });
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
            }
            console.log(`Stdout: ${stdout}`);

            // Read the content of the .mp4 file
            const fileContent = fs.readFileSync(finalOutputFilePath);
            return res.json({ videoContent: fileContent.toString('base64') });
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: e.message });
    }
};
