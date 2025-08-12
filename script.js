function loadPage(page) {
  const content = document.getElementById('content_mainPage');
  if (page === 'main') {
    content.innerHTML = `<button class="registration_btn main_btn">Fight!</button>`;
  }
  if (page === 'profile') {
    content.innerHTML = `
      <div class="profile_page">
        <div class="profile_img">
          <img src="assets/Mulan.webp"></img>

        <div class="overlay_avatar"><button id="change-photo-btn"></button></div></div>
        <div class="modal" id="modal">
        <div class="modal_content">
        <span class="close_btn" id="close-modal">&times;</span>
        <h3>Choose your avatar</h3>
        <div class="avatars_list">
        <div class="avatar_item">
        <img src="assets/Moana.png">
        <button class="checked_btn"></button>
        </div>
        <div class="avatar_item">
        <img src="assets/Ariel.webp">
        <button class="checked_btn"></button>
        </div>
        <div class="avatar_item">
        <img src="assets/Rapunzel.webp">
      <button class="checked_btn"></button>
        </div>
        <div class="avatar_item">
        <img src="assets/Mulan.webp">
      <button class="checked_btn"></button>
        </div>
        </div>
        </div>
        </div>
        <span class="profile_name">Mulan</span>
<p class="profile_wins">Wins: <span class="profile_wins_num"></span></p>
<p class="profile_loses">Loses: <span class="profile_loses_num"></span></p>
      </div>
    `;
    const modal = document.getElementById('modal');
    const openBtn = document.getElementById('change-photo-btn');
    const closeBtn = document.getElementById('close-modal');
    const profileImg = document.querySelector('.profile_img img');
    const avatarItems = document.querySelectorAll('.avatar_item');

    openBtn.addEventListener('click', () => {
      modal.style.display = 'flex';
    });
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });

    avatarItems.forEach((avatar) =>
      avatar.addEventListener('click', () => {
        const clickedImg = avatar.querySelector('img');
        if (clickedImg) {
          profileImg.src = clickedImg.src;
        }
        modal.style.display = 'none';
      })
    );
  }
}
