async function getInfo(){
    const user = document.getElementById("username").value;
    const result = document.getElementById("result");

    result.innerHTML = "Đang tải...";

    try{
        const res = await fetch(`https://www.tikwm.com/api/user/info?unique_id=${user}`);
        const data = await res.json();

        const u = data.data.user;
        const s = data.data.stats;

        let html = `
        <div class="card">
            <img src="${u.avatar}">
            <h2>${u.nickname}</h2>
            <p>👤 @${u.unique_id}</p>
            <p>👥 Followers: ${s.follower_count}</p>
            <p>❤️ Likes: ${s.total_favorited}</p>
            <p>🎥 Videos: ${s.video_count}</p>
        </div>
        `;

        // Lấy video
        const res2 = await fetch(`https://www.tikwm.com/api/user/posts?unique_id=${user}`);
        const data2 = await res2.json();

        html += "<h2>📹 Video</h2>";

        data2.data.videos.slice(0,5).forEach(v => {
            html += `
            <div class="video">
                <video src="${v.play}" controls width="250"></video>
                <p>❤️ ${v.digg_count}</p>
            </div>
            `;
        });

        result.innerHTML = html;

    }catch(e){
        result.innerHTML = "❌ Lỗi hoặc username sai!";
    }
}