async function getInfo(){
    const user = document.getElementById("username").value.trim();
    const result = document.getElementById("result");

    if(!user){
        result.innerHTML = "⚠️ Nhập username!";
        return;
    }

    result.innerHTML = "⏳ Đang tải...";

    try{
        // ✅ API mới (ổn định hơn)
        const res = await fetch(`https://tiktok-api23.p.rapidapi.com/api/user/info?uniqueId=${user}`, {
            method: "GET",
            headers: {
                "X-RapidAPI-Key": "demo-key", // ⚠️ có thể cần đổi key nếu lỗi
                "X-RapidAPI-Host": "tiktok-api23.p.rapidapi.com"
            }
        });

        const data = await res.json();

        if(!data.userInfo){
            throw new Error("Không tìm thấy");
        }

        const u = data.userInfo.user;
        const s = data.userInfo.stats;

        let html = `
        <div class="card">
            <img class="avatar" src="${u.avatarLarger}">
            <h2>${u.nickname}</h2>
            <p>@${u.uniqueId}</p>
            <p>👥 ${s.followerCount} Followers</p>
            <p>❤️ ${s.heart} Likes</p>
            <p>🎥 ${s.videoCount} Videos</p>
        </div>
        `;

        // 📹 video
        const res2 = await fetch(`https://tikwm.com/api/user/posts?unique_id=${user}`);
        const data2 = await res2.json();

        html += "<h2>📹 Video mới</h2>";

        data2.data.videos.slice(0,3).forEach(v=>{
            html += `
            <div class="video">
                <video src="${v.play}" controls width="260"></video>
                <p>❤️ ${v.digg_count}</p>
            </div>
            `;
        });

        result.innerHTML = html;

    }catch(err){
        result.innerHTML = `
        ❌ Lỗi API (do TikTok chặn hoặc key hết hạn)<br><br>
        👉 Cách fix:
        <br>- Dùng VPN
        <br>- Hoặc đổi API khác
        `;
    }
}