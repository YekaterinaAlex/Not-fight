let wins = Number(localStorage.getItem('wins')) || 0;
let losses = Number(localStorage.getItem('losses')) || 0;
function updateScoreboard() {
  const winsEl = document.getElementById('winsCount');
  const lossesEl = document.getElementById('lossesCount');
  if (winsEl && lossesEl) {
    winsEl.textContent = wins;
    lossesEl.textContent = losses;
  }
}
function saveName() {
  const charName = document.querySelector('.charactername-input').value.trim();
  if (!charName) {
    alert('Please enter a character name!');
    return;
  }
  localStorage.setItem('username', charName);
  window.location.href = 'home.html';
}

let selectedAvatar = 'assets/Mulan.webp';
const enemyImages = [
  'assets/Ursula.png',
  'assets/villains.jpg',
  'assets/yzma.webp',
];

function getRandomEnemyImg() {
  const randomIndex = Math.floor(Math.random() * enemyImages.length);
  return enemyImages[randomIndex];
}

function loadPage(page) {
  const content = document.getElementById('content_mainPage');
  if (page === 'main') {
    const pageName = document.getElementById('pageName');
    pageName.textContent = 'Main';
    content.innerHTML = `<button id="fight_btn" class="registration_btn main_btn">Fight!</button>`;
    const fightBtn = document.getElementById('fight_btn');
    fightBtn.addEventListener('click', () => {
      loadPage('fightPage');
    });
  }
  if (page === 'settings') {
    const pageName = document.getElementById('pageName');
    pageName.textContent = 'Settings';
    content.innerHTML = `
    <span>Player Name:</span>
    <span id="settingName"></span>
    <button class="edit_btn" id="editBtn">Edit</button>
    `;
    const settingName = document.getElementById('settingName');
    settingName.textContent = localStorage.getItem('username');

    const editBtn = document.getElementById('editBtn');
    editBtn.addEventListener('click', () => {
      if (editBtn.textContent === 'Edit') {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = settingName.textContent;
        input.id = 'edit-name-input';
        settingName.replaceWith(input);
        editBtn.textContent = 'Save';
      } else {
        const input = document.getElementById('edit-name-input');
        const newName = input.value.trim() || 'Hero';
        localStorage.setItem('username', newName);
        const newSpan = document.createElement('span');
        newSpan.id = 'settingName';
        newSpan.textContent = newName;
        input.replaceWith(newSpan);
        editBtn.textContent = 'Edit';
      }
    });
  }
  if (page === 'fightPage') {
    pageName.textContent = 'Battle';
    const randomEnemy = getRandomEnemyImg();
    content.innerHTML = `
    <div class="fight_conteiner">
    <div class="player_panel">
    <span id="mainProfileName"></span><br>
    <div class="profile_img">
    <img src="${selectedAvatar}"></div>
    <div class="health_bar">
    <div id="playerHealthBar" class="health_fill"></div>
    <span id="playerHealthText" class="health_text">150 / 150</span>
    </div>
    </div>
    <div class="attack_panel">
    <p>Please pick 1 Attack zone and 2 Defence zones</p>

    <div class="attack_panel_zones">
    <div class="attack_zones">
      <span>Attack Zones</span><br>
        <label><input type="radio" name="attack_zone" value="head"> Head</label>
        <label><input type="radio" name="attack_zone" value="neck"> Neck</label>
        <label><input type="radio" name="attack_zone" value="body"> Body</label>
        <label><input type="radio" name="attack_zone" value="belly"> Belly</label>
        <label><input type="radio" name="attack_zone" value="legs"> Legs</label>
       </div>
      <div class="defence_zones">
        <span>Defence Zones</span>
        <label><input type="checkbox" name="defense_zone" value="head"> Head</label>
        <label><input type="checkbox" name="defense_zone" value="neck"> Neck</label>
        <label><input type="checkbox" name="defense_zone" value="body"> Body</label>
        <label><input type="checkbox" name="defense_zone" value="belly"> Belly</label>
        <label><input type="checkbox" name="defense_zone" value="legs"> Legs</label>

    </div>
    </div>
    </div>
    <div class="enemy_panel">
      <span>Enemy</span><br>
      <div class="enemy_img">
        <img src="${randomEnemy}">
      </div>
       <div class="health_bar">
        <div id="enemyHealthBar" class="health_fill"></div>
        <span id="enemyHealthText" class="health_text">150 / 150</span>
      </div>
    </div>
    </div>

    <button class="attack_btn">Attack!</button>

    <div class="logs">



    </div>
    `;

    const zones = ['head', 'neck', 'body', 'belly', 'legs'];
    let playerHealth = 150;
    let enemyHealth = 150;
    const maxHealth = 150;

    function logAttack(
      attackerName,
      defenderName,
      attackZone,
      defenderDefendedZones
    ) {
      const logsContainer = document.querySelector('.logs');
      const isBlocked = defenderDefendedZones.includes(attackZone);

      const message = isBlocked
        ? `<p class="fight_message"><span class="attacker">${attackerName}</span> attacked <span class="defender">${defenderName}</span> on <span class="attack_zone">${attackZone}</span> but  <span class="defender">${defenderName}</span> protected it!</p>`
        : `<p class="fight_message"><span class="attacker">${attackerName}</span> attacked <span class="defender">${defenderName}</span> on <span class="attack_zone">${attackZone}</span> and it was successful!</p>`;
      logsContainer.innerHTML += message;
      logsContainer.scrollTop = logsContainer.scrollHeight;
      if (!isBlocked) {
        if (attackerName === 'You') {
          enemyHealth = Math.max(0, enemyHealth - 20);
          updateHealth(
            'enemyHealthBar',
            'enemyHealthText',
            enemyHealth,
            maxHealth
          );
        } else {
          playerHealth = Math.max(0, playerHealth - 20);
          updateHealth(
            'playerHealthBar',
            'playerHealthText',
            playerHealth,
            maxHealth
          );
        }
      }
      checkGameOver();
    }

    function checkGameOver() {
      if (enemyHealth <= 0) {
        wins++;
        localStorage.setItem('wins', wins);
        updateScoreboard();
        alert('🎉 You won!');
        loadPage('profile');
      } else if (playerHealth <= 0) {
        losses++;
        localStorage.setItem('losses', losses);
        updateScoreboard();
        alert('💀 You lost!');
        loadPage('profile');
      }
    }

    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('attack_btn')) {
        // --- PLAYER attack ---
        const attackZone = document.querySelector(
          'input[name="attack_zone"]:checked'
        )?.value;
        const defenseZones = Array.from(
          document.querySelectorAll('input[name="defense_zone"]:checked')
        ).map((cb) => cb.value);

        if (!attackZone || defenseZones.length !== 2) {
          alert('Pick 1 attack zone and 2 defense zones!');
          return;
        }

        // enemy chooses randomly
        const enemyAttack = zones[Math.floor(Math.random() * zones.length)];
        const shuffled = [...zones].sort(() => 0.5 - Math.random());
        const enemyDefense = shuffled.slice(0, 2);

        // log player attack
        logAttack('You', 'Enemy', attackZone, enemyDefense);

        // log enemy attack
        logAttack('Enemy', 'You', enemyAttack, defenseZones);
      }
    });

    function updateHealth(barId, textId, currentHealth, maxHealth) {
      const bar = document.getElementById(barId);
      const text = document.getElementById(textId);
      const percent = (currentHealth / maxHealth) * 100;
      bar.style.width = percent + '%';
      text.textContent = `${currentHealth} / ${maxHealth}`;

      if (percent > 60) {
        bar.style.background = 'green';
      } else if (percent > 30) {
        bar.style.background = 'orange';
      } else {
        bar.style.background = 'red';
      }
    }

    const mainName = document.getElementById('mainProfileName');
    mainName.textContent = localStorage.getItem('username');
    document
      .querySelectorAll('input[name="defense_zone"]')
      .forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
          const checked = document.querySelectorAll(
            'input[name="defense_zone"]:checked'
          );
          if (checked.length > 2) {
            checkbox.checked = false; // undo selection if over limit
            alert('You can only choose up to 2 defense zones!');
          }
        });
      });
  }
  if (page === 'profile') {
    const pageName = document.getElementById('pageName');
    pageName.textContent = 'Character';
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
        <span class="profile_name" id="profileName"></span>
        <p class="profile_wins">Wins: <span class="profile_wins_num" id="winsCount">0</span></p>
        <p class="profile_loses">Loses: <span class="profile_loses_num" id="lossesCount">0</span></p>
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
          selectedAvatar = clickedImg.src;
          profileImg.src = clickedImg.src;
        }
        modal.style.display = 'none';
      })
    );
    const userName = localStorage.getItem('username');
    if (userName) {
      document.getElementById('profileName').textContent = `${userName}`;
    } else {
      document.getElementById('profileName').textContent = `Hero!`;
    }
    updateScoreboard();
  }
}
