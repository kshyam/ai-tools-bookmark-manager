document.getElementById('bookmarkTool').addEventListener('click', function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const activeTab = tabs[0];
    const tool = {
      url: activeTab.url
    };

    chrome.storage.sync.get('aiTools', function(data) {
      let tools = data.aiTools || [];
      const isUnique = tools.every(t => t.url !== tool.url);

      if (isUnique) {
        tools.push(tool);
        chrome.storage.sync.set({ aiTools: tools }, function() {
          displayTools();
        });
      }
    });
  });
});

function displayTools(filter = '') {
  chrome.storage.sync.get('aiTools', function(data) {
    const toolList = document.getElementById('toolList');
    toolList.innerHTML = '';
    const tools = data.aiTools || [];

    const filteredTools = tools.filter(tool => tool.url.includes(filter));

    filteredTools.forEach(function(tool, index) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = tool.url;
      a.textContent = tool.url;
      a.target = '_blank';

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'X';
      deleteButton.className = 'deleteButton';
      deleteButton.addEventListener('click', function() {
        deleteTool(index);
      });

      li.appendChild(a);
      li.appendChild(deleteButton);
      toolList.appendChild(li);
    });
  });
}

function deleteTool(index) {
  chrome.storage.sync.get('aiTools', function(data) {
    let tools = data.aiTools || [];
    tools.splice(index, 1);
    chrome.storage.sync.set({ aiTools: tools }, function() {
      displayTools();
    });
  });
}

document.getElementById('exportCSV').addEventListener('click', function() {
  chrome.storage.sync.get('aiTools', function(data) {
    const tools = data.aiTools || [];
    let csvContent = "data:text/csv;charset=utf-8,URL\n";
    tools.forEach(function(tool) {
      csvContent += `${tool.url}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ai_tools_bookmarks.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
});

document.getElementById('searchInput').addEventListener('input', function() {
  const filter = this.value.trim();
  displayTools(filter);
});

document.addEventListener('DOMContentLoaded', function() {
  displayTools();
});
