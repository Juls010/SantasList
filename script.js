document.addEventListener("DOMContentLoaded", () => {
    const elements = {
        form: document.querySelector(".todo-form"),
        list: document.querySelector(".todo-list"),
        nameInput: document.querySelector('input[type="text"]'),
        linkInput: document.querySelector('input[type="url"]'),
        descInput: document.getElementById("giftDescription"),
        prioritySelect: document.getElementById("giftPriority"),
        saveBtn: document.querySelector(".todo-form button"),
        santaSwitch: document.getElementById("santaModeBtn"),
        stats: {
            total: document.getElementById("total-gifts"),
            bought: document.getElementById("total-bought"),
            highPending: document.getElementById("pending-high")
        }
    };

    let isEditing = false; 
    let originalBtnText = elements.saveBtn ? elements.saveBtn.innerHTML : "Add Gift";
    let originalPlaceholder = elements.descInput ? elements.descInput.placeholder : "";

    function getGifts() {
        const savedData = localStorage.getItem("santaList");
        if (savedData) {
            return JSON.parse(savedData);
        } else {
            return [];
        }
    }

    function saveGifts(giftList) {
        localStorage.setItem("santaList", JSON.stringify(giftList));
    }

    function addGift(newGift) {
        const list = getGifts();
        list.push(newGift);
        saveGifts(list);
    }

    function deleteGift(giftName) {
        const list = getGifts();
        const newList = list.filter(function(gift) {
            return gift.name !== giftName;
        });
        saveGifts(newList);
    }

    function toggleBought(giftName) {
        const list = getGifts();
        const foundGift = list.find(function(gift) {
            return gift.name === giftName;
        });

        if (foundGift) {
            foundGift.bought = !foundGift.bought; 
            saveGifts(list);
        }
    }

    function renderList() {
        if (!elements.list) return;
        elements.list.innerHTML = "";
        
        const gifts = getGifts();
        const isSantaMode = document.body.classList.contains("santa-mode");

        updateStats(gifts);

        gifts.forEach(function(gift) {
            if (gift.isSurprise === true && isSantaMode === false) {
                return; 
            }

            const card = document.createElement("div");
            
            let cardClasses = "todo-card";
            if (gift.bought === true) {
                cardClasses += " completed";
            }

            card.className = cardClasses;
            card.dataset.name = gift.name;
            const surpriseIcon = gift.isSurprise ? '<i class="fa-solid fa-user-secret" title="Secret"></i> ' : '';

            let priorityLabel = "";
            if (!gift.isSurprise) {
                if (gift.priority === "low") priorityLabel = "🎁 Low";
                else if (gift.priority === "medium") priorityLabel = "⭐ Medium";
                else if (gift.priority === "high") priorityLabel = "🌟 High";
            }

            card.innerHTML = `
                <div class="card-header">
                    <h3 class="card-title">${surpriseIcon}${gift.name}</h3>
                    <div class="card-actions">
                        <button class="action-btn check-btn"><i class="fa-regular fa-square-check"></i></button>
                        <button class="action-btn edit-btn"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="action-btn delete-btn"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>
                ${gift.description ? `<p class="card-description">${gift.description}</p>` : ""}
                ${gift.link ? `<a href="${gift.link}" class="card-link" target="_blank">Link 🔗</a>` : ""}
                
                <div class="card-footer">
                    <span class="card-priority">${priorityLabel}</span>
                </div>
            `;

            elements.list.appendChild(card);
        });
    }

    function updateStats(gifts) {
        if (!elements.stats.total) return;

        const total = gifts.length;
        
        const boughtCount = gifts.filter(function(g) { 
            return g.bought === true; 
        }).length;

        const highPriorityCount = gifts.filter(function(g) { 
            return g.priority === 'high' && g.bought === false; 
        }).length;

        elements.stats.total.innerText = total;
        elements.stats.bought.innerText = boughtCount;
        elements.stats.highPending.innerText = highPriorityCount;
    }

    function setupSantaMode(isActive) {
        if (isActive) {
            document.body.classList.add("santa-mode");
        } else {
            document.body.classList.remove("santa-mode");
        }
        
        localStorage.setItem("santaMode", isActive);

        if (elements.saveBtn) {
            if (isActive) {
                elements.saveBtn.innerHTML = 'Add to list <i class="fa-solid fa-envelope-circle-check"></i>';
                elements.descInput.placeholder = "Notes (Price, store, details...)";
            } else {
                elements.saveBtn.innerHTML = originalBtnText;
                elements.descInput.placeholder = originalPlaceholder;
            }
        }
        
        renderList();
    }

    if (elements.santaSwitch) {
        const savedMode = localStorage.getItem("santaMode") === "true";
        elements.santaSwitch.checked = savedMode;
        setupSantaMode(savedMode);

        elements.santaSwitch.addEventListener("change", (e) => {
            setupSantaMode(e.target.checked);
        });
    }

    if (elements.list) {
        elements.list.addEventListener("click", (event) => {
            const btn = event.target.closest("button");
            if (!btn) return; 
            const card = btn.closest(".todo-card");
            const giftName = card.dataset.name;

            if (btn.classList.contains("check-btn")) {
                toggleBought(giftName);
                renderList();
            
            } else if (btn.classList.contains("delete-btn")) {
                deleteGift(giftName);
                renderList();
            
            } else if (btn.classList.contains("edit-btn")) {
                const list = getGifts();
                const itemToEdit = list.find(g => g.name === giftName);

                if (itemToEdit) {
                    elements.nameInput.value = itemToEdit.name;
                    elements.linkInput.value = itemToEdit.link || "";
                    elements.descInput.value = itemToEdit.description || "";
                    setCustomSelectValue(itemToEdit.priority);
                    
                    deleteGift(giftName); 
                    
                    isEditing = true;
                    elements.saveBtn.innerHTML = "Save Changes";
                    
                    elements.form.scrollIntoView({ behavior: "smooth" });
                }
            }
        });
    }

    if (elements.form) {
        elements.form.addEventListener("submit", (e) => {
            e.preventDefault();

            const newGift = {
                name: elements.nameInput.value.trim(),
                link: elements.linkInput.value.trim(),
                description: elements.descInput.value.trim(),
                priority: elements.prioritySelect.value,
                bought: false,
                isSurprise: document.body.classList.contains("santa-mode")
            };

            if (newGift.name === "") return;

            addGift(newGift);
            renderList();
            
            elements.form.reset();
            resetCustomSelect();

            isEditing = false;
            setupSantaMode(document.body.classList.contains("santa-mode")); 
            
            setTimeout(() => {
                elements.list.scrollTo({ top: elements.list.scrollHeight, behavior: 'smooth' });
            }, 100);
        });
    }

    setupCustomSelect();
    startCountdown();
    setupWelcomeModal();
    
    renderList(); 
});

function startCountdown() {
    const d = document.getElementById("days");
    const h = document.getElementById("hours");
    const m = document.getElementById("minutes");
    if (!d) return;

    function update() {
        const now = new Date();
        const currentYear = now.getFullYear();
        let xmas = new Date(currentYear, 11, 25); 
        
        if (now > xmas) {
            xmas.setFullYear(currentYear + 1);
        }
        
        const diff = xmas - now;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);

        d.innerText = days.toString().padStart(2, '0');
        h.innerText = hours.toString().padStart(2, '0');
        m.innerText = minutes.toString().padStart(2, '0');
    }
    
    setInterval(update, 1000);
    update();
}

function setupWelcomeModal() {
    const modal = document.getElementById("welcomeModal");
    if (!modal) return;
    
    function close() { 
        modal.classList.remove('show'); 
        localStorage.setItem('santaTutorialSeen', 'true'); 
    }
    
    const closeButtons = document.querySelectorAll(".close-trigger");
    closeButtons.forEach(btn => {
        btn.addEventListener("click", close);
    });

    const helpBtn = document.getElementById("helpBtn");
    if(helpBtn) {
        helpBtn.addEventListener("click", () => modal.classList.add('show'));
    }

    if (!localStorage.getItem('santaTutorialSeen')) {
        setTimeout(() => modal.classList.add('show'), 1000);
    }
}

function setupCustomSelect() {
    const nativeSelect = document.getElementById("giftPriority");
    
    if (!nativeSelect || nativeSelect.parentNode.querySelector(".custom-select")) return;
    
    nativeSelect.classList.add("hidden");

    const wrapper = document.createElement("div"); 
    wrapper.className = "custom-select";
    
    const head = document.createElement("div"); 
    head.className = "select-headboard"; 
    head.textContent = "⭐ Medium";
    
    const optionsList = document.createElement("div"); 
    optionsList.className = "select-options";
    
    Array.from(nativeSelect.options).forEach(option => {
        const optionDiv = document.createElement("div");
        optionDiv.className = "option";
        optionDiv.textContent = option.text;
        
        optionDiv.onclick = () => {
            nativeSelect.value = option.value;
            head.textContent = option.text;
            optionsList.classList.remove("view");
        };
        optionsList.appendChild(optionDiv);
    });
    
    wrapper.appendChild(head);
    wrapper.appendChild(optionsList);
    
    nativeSelect.parentNode.insertBefore(wrapper, nativeSelect.nextSibling);
    
    head.onclick = (e) => { 
        e.stopPropagation(); 
        optionsList.classList.toggle("view"); 
    };
    
    document.addEventListener("click", (e) => { 
        if (!wrapper.contains(e.target)) {
            optionsList.classList.remove("view");
        }
    });
}

function setCustomSelectValue(value) {
    const nativeSelect = document.getElementById("giftPriority");
    if (nativeSelect) {
        nativeSelect.value = value;
        const option = Array.from(nativeSelect.options).find(o => o.value === value);
        const head = document.querySelector(".select-headboard");
        if (head && option) {
            head.textContent = option.text;
        }
    }
}

function resetCustomSelect() { 
    setCustomSelectValue("medium"); 
}