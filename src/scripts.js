$(document).ready(function() {
    $(".icon").draggable();
    $(".window").draggable({
        handle: ".window-header"
    }).resizable();

    $(".window").each(function() {
        let appId = $(this).attr('id');
        $("#task-" + appId).hide();
    });

    setToolbarSections([]);
    updateToolbarTitle('Desktop');
});

function openWindow(appId) {
    const windowElement = document.getElementById(appId);
    if (windowElement) {
        const desktopElement = document.getElementById('desktop');
        const windowWidth = $(windowElement).outerWidth();
        const windowHeight = $(windowElement).outerHeight();
        const desktopWidth = $(desktopElement).width();
        const desktopHeight = $(desktopElement).height();

        const top = (desktopHeight - windowHeight) / 2;
        const left = (desktopWidth - windowWidth) / 2;

        $(windowElement).css({
            top: top + 'px',
            left: left + 'px',
            zIndex: 10
        }).show();

        $(".window").not(windowElement).css('z-index', 1);
        $("#task-" + appId).show();
        updateToolbar(appId);
        updateToolbarTitle(windowElement.querySelector('.window-header span').textContent);
    }
}

function closeWindow(appId) {
    const windowElement = document.getElementById(appId);
    if (windowElement) {
        $(windowElement).hide();
        $("#task-" + appId).hide();
        updateToolbarTitle('Desktop');
    }
}

function focusWindow(appId) {
    const windowElement = document.getElementById(appId);
    if (windowElement) {
        $(windowElement).css('z-index', 10);
        $(".window").not(windowElement).css('z-index', 1);
        updateToolbar(appId);
        updateToolbarTitle(windowElement.querySelector('.window-header span').textContent);
    }
}

function openFile() {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';

    input.onchange = function(event) {
        let file = event.target.files[0];
        if (file) {
            let reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('notepad-textarea').value = e.target.result;
            };
            reader.readAsText(file);
        }
    };

    input.click();
}

function saveFile() {
    let text = document.getElementById('notepad-textarea').value;
    let blob = new Blob([text], { type: 'text/plain' });
    let anchor = document.createElement('a');
    anchor.download = 'note.txt';
    anchor.href = window.URL.createObjectURL(blob);
    anchor.target = '_blank';
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}

function setToolbarSections(sections) {
    const toolbar = document.getElementById('toolbar-sections');
    toolbar.innerHTML = '';

    sections.forEach(section => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'toolbar-section';

        section.buttons.forEach(button => {
            const buttonElement = document.createElement('button');
            buttonElement.className = 'toolbar-button';
            buttonElement.textContent = button.label;
            buttonElement.onclick = button.action;
            sectionDiv.appendChild(buttonElement);
        });

        toolbar.appendChild(sectionDiv);
    });
}

function updateToolbar(appId) {
    if (appId === 'notepad') {
        setToolbarSections([
            {
                buttons: [
                    { label: 'Open', action: openFile },
                    { label: 'Save', action: saveFile }
                ]
            }
        ]);
    } else {
        setToolbarSections([]);
    }
}

function updateToolbarTitle(title) {
    const toolbarTitle = document.getElementById('toolbar-title');
    toolbarTitle.textContent = title;
}
