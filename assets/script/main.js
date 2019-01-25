jQuery(function ($) {
  let todos = [];
  const list = $('#todolist');
  const input = $('input');
  function addTodo(value, state) {
      todos.push({
          value,
          state: state || false
      });
      renderTodos();
  }
  function removeTodo(index) {
      todos.splice(index, 1);
      renderTodos();
  }
  function setTodo(index, value) {
      todos[index].value = value;
      renderTodos();
  }
  function checkTodo(index) {
      todos[index].state = !todos[index].state;
      renderTodos();
  }
  function saveTodos() {
      localStorage.setItem('todos', JSON.stringify(todos));
  }
  function loadTodos() {
      todos = JSON.parse(localStorage.getItem('todos'));
      renderTodos();
  }
  function renderTodos() {
      list.empty();
      $.each(todos, function (i) {
          list.append(
              `
          <li>
          ${this.state ? '<i data-type="state" class="far fa-check-circle"></i>' : '<i data-type="state" class="far fa-circle"></i>'}
          ${this.value}
          <i data-type="edit" class="fas fa-pencil-alt"></i>
          <i data-type="delete" class="fas fa-trash-alt"></i>    
          </li>
          `
          );

      });
  }
  input.on('change', function (e) {
      console.log(input.data('idx'));
      if (input.data('idx') === undefined) {
          addTodo(this.value);
      } else {
          setTodo(input.data('idx'), this.value);
          input.data('idx', undefined);
      }
      this.value = '';
  });
  $('#todolist').on('click', function (e) {
      const target = $(e.target);
      const li = $(e.target.parentElement);
      const idx = li.index();
      if (target.data('type') == 'delete') {
          removeTodo(idx);
      } else if (target.data('type') == 'edit') {
          input.val(todos[idx].value);
          input.data('idx', idx);

      } else if (target.data('type') == 'state') {
          checkTodo(idx);
      }
  });
  $('#save').on('click', function (e) {
      saveTodos();
  });
  $('#loadmore').on('click', function (e) {
      $.get(
          "https://jsonplaceholder.typicode.com/todos",{}, onAjaxSuccess, 'json'
      );
      function onAjaxSuccess(data, textStatus) {
          const arr = data.slice(0, 20);
          for (let i = 0; i<arr.length; i++) {
              addTodo(arr[i].title, arr[i].completed);
          }
      }
  });
  loadTodos();
});