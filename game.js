const log = document.getElementById('log');
const commandInput = document.getElementById('command');
const sendBtn = document.getElementById('send');

let state = {
    player: {
        name: '용사',
        hp: 30,
        maxHp: 30,
        atk: 5,
        gold: 0,
        exp: 0,
        level: 1
    },
    monster: null,
    stage: 1,
    inBattle: false
};

function logMsg(msg) {
    log.innerHTML += `<div>${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

function startGame() {
    logMsg('당신은 모험을 떠나는 용사입니다!');
    logMsg('명령어: "탐험", "상태", "회복", "도움말"');
}

function showHelp() {
    logMsg('명령어 목록:');
    logMsg('탐험 - 몬스터를 찾아 싸웁니다.');
    logMsg('상태 - 내 상태를 확인합니다.');
    logMsg('회복 - HP를 모두 회복합니다. (10골드 필요)');
    logMsg('도움말 - 명령어를 다시 봅니다.');
}

function showStatus() {
    const p = state.player;
    logMsg(`Lv.${p.level} ${p.name} | HP: ${p.hp}/${p.maxHp} | ATK: ${p.atk} | GOLD: ${p.gold} | EXP: ${p.exp}`);
}

function heal() {
    if (state.player.gold >= 10) {
        state.player.gold -= 10;
        state.player.hp = state.player.maxHp;
        logMsg('HP가 모두 회복되었습니다!');
    } else {
        logMsg('골드가 부족합니다!');
    }
}

function explore() {
    if (state.inBattle) {
        logMsg('이미 전투 중입니다!');
        return;
    }
    // 몬스터 생성
    const monsters = [
        { name: '고블린', hp: 10, atk: 3, gold: 5, exp: 5 },
        { name: '슬라임', hp: 8, atk: 2, gold: 3, exp: 3 },
        { name: '늑대', hp: 12, atk: 4, gold: 7, exp: 7 }
    ];
    const m = monsters[Math.floor(Math.random() * monsters.length)];
    state.monster = { ...m };
    state.inBattle = true;
    logMsg(`${m.name}이(가) 나타났다! (HP: ${m.hp}, ATK: ${m.atk})`);
    logMsg('명령어: "공격", "도망"');
}

function attack() {
    if (!state.inBattle) {
        logMsg('공격할 대상이 없습니다!');
        return;
    }
    const p = state.player;
    const m = state.monster;
    // 플레이어 공격
    m.hp -= p.atk;
    logMsg(`당신이 ${m.name}을(를) 공격! (${p.atk} 데미지)`);
    if (m.hp <= 0) {
        logMsg(`${m.name}을(를) 물리쳤다! GOLD +${m.gold}, EXP +${m.exp}`);
        p.gold += m.gold;
        p.exp += m.exp;
        state.inBattle = false;
        state.monster = null;
        levelUpCheck();
        return;
    }
    // 몬스터 반격
    p.hp -= m.atk;
    logMsg(`${m.name}의 반격! (${m.atk} 데미지)`);
    if (p.hp <= 0) {
        logMsg('당신은 쓰러졌다... 게임 오버!');
        sendBtn.disabled = true;
        commandInput.disabled = true;
    }
}

function run() {
    if (!state.inBattle) {
        logMsg('도망칠 상대가 없습니다!');
        return;
    }
    if (Math.random() < 0.5) {
        logMsg('도망에 성공했다!');
        state.inBattle = false;
        state.monster = null;
    } else {
        logMsg('도망에 실패했다!');
        // 몬스터 반격
        const m = state.monster;
        const p = state.player;
        p.hp -= m.atk;
        logMsg(`${m.name}의 공격! (${m.atk} 데미지)`);
        if (p.hp <= 0) {
            logMsg('당신은 쓰러졌다... 게임 오버!');
            sendBtn.disabled = true;
            commandInput.disabled = true;
        }
    }
}

function levelUpCheck() {
    const p = state.player;
    const needExp = p.level * 10;
    if (p.exp >= needExp) {
        p.exp -= needExp;
        p.level++;
        p.maxHp += 5;
        p.atk += 2;
        p.hp = p.maxHp;
        logMsg(`레벨 업! Lv.${p.level} (HP: ${p.maxHp}, ATK: ${p.atk})`);
    }
}

function handleCommand(cmd) {
    cmd = cmd.trim();
    if (cmd === '') return; // 빈 입력은 무시
    if (cmd === '탐험') explore();
    else if (cmd === '상태') showStatus();
    else if (cmd === '회복') heal();
    else if (cmd === '공격') attack();
    else if (cmd === '도망') run();
    else if (cmd === '도움말') showHelp();
    else logMsg('알 수 없는 명령어입니다. "도움말"을 입력해보세요.');
}

sendBtn.addEventListener('click', () => {
    const cmd = commandInput.value;
    if (cmd) {
        handleCommand(cmd);
        commandInput.value = '';
        commandInput.focus();
    }
});

commandInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});

startGame();
