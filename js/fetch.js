document.addEventListener('DOMContentLoaded', function() {
    let videoData = {};
    let players = {};

    fetch('videos.json')
        .then(response => response.json())
        .then(data => {
            videoData = data;
            const articles = document.querySelectorAll('article[data-post-id]');
            articles.forEach(article => {
                const postId = article.getAttribute('data-post-id');
                const playerId = `player-${postId}`;
                const videoIds = videoData[postId];

                if (videoIds) {
                    players[postId] = initYouTubePlayer(playerId, videoIds);
                }
            });

            // Add event listeners for buttons
            const prevButtons = document.querySelectorAll('.prev-video');
            const nextButtons = document.querySelectorAll('.next-video');

            prevButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const postId = button.getAttribute('data-post-id');
                    changeVideo(postId, -1);
                });
            });

            nextButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const postId = button.getAttribute('data-post-id');
                    changeVideo(postId, 1);
                });
            });
        })
        .catch(error => {
            console.error('Error fetching the video list:', error);
        });

    function initYouTubePlayer(playerId, videoIds) {
        const playerElement = document.getElementById(playerId);
        return new YT.Player(playerElement, {
            height: '500px',
            width: '100%',
            videoId: videoIds[0],
            playerVars: { 'autoplay': 0, 'controls': 1, 'playlist': videoIds.slice(1).join(',') },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }

    function changeVideo(postId, direction) {
        const player = players[postId];
        const videoIds = videoData[postId];
        let currentVideoIndex = videoIds.indexOf(player.getVideoData().video_id);
        let newVideoIndex = currentVideoIndex + direction;

        if (newVideoIndex < 0) {
            newVideoIndex = videoIds.length - 1;
        } else if (newVideoIndex >= videoIds.length) {
            newVideoIndex = 0;
        }

        player.loadVideoById(videoIds[newVideoIndex]);
    }

    function onPlayerReady(event) {
        event.target.setVolume(100);
    }

    function onPlayerStateChange(event) {
        // Możesz dodać logikę tutaj, jeśli jest potrzebna
    }

    // Funkcja YouTube API
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});
