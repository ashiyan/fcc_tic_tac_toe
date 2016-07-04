/* jshint browser: true */

document.addEventListener( "DOMContentLoaded", function() {
	
	// Изначальный запрет на совершение хода
	var moving_access = false;
	
	// Переменная-ход игрока и компьютера. 1 - "Х", 2 - "О"
	var human = 0, pc = 0;
	
	// Массив с расположением крестиков и ноликов на поле
	var map = [0,0,0,0,0,0,0,0,0];
	
	// Массив с выигрышными комбинациями
	var combo = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
	
	// Функция проверки победы и ничьи
	function check_win(num) {
		
		// Проверка выигрышных комбинаций
		for (var i = 0; i < combo.length; i++) {
			
			// Берем индексы из массива комбинаций и используя их, перемножаем соответствующие числа на карте
			// Если получившееся число равно кубу проверяемого числа - значит найдена выигрышная комбинация
			if (map[combo[i][0]] * map[combo[i][1]] * map[combo[i][2]] === Math.pow(num, 3)) {
				
				// Выводим имя победителя
				document.querySelector(".winner").innerHTML = human === num ? "You win!" : "PC win!";
				
				// Применяем анимацию на соответствующие клетки в зависимости от победителя
				for (var j = 0; j < 3; j++)
					document.querySelector(".cell" + combo[i][j]).style.animation = human === num ? "user_win 1s linear infinite" : "pc_win 1s linear infinite";
				for (var j = 0; j < 3; j++)
					document.querySelector(".cell" + combo[i][j]).style.WebkitAnimation = human === num ? "user_win 1s linear infinite" : "pc_win 1s linear infinite";
				
				// Запрещаем дальнейшие ходы
				moving_access = false;
			}
		}
		
		// Если на карте нет ни одного нуля - значит ходов больше нет, ничья
		if (moving_access && map.filter(function (number) { return number === 0; }).length === 0) {
			document.querySelector(".winner").innerHTML = "Draw...";
			moving_access = false;
		}
		
	}
	
	// Ход компьютера
	function pc_move() {
		
		// Ход возможен, только если он разрешен
		if (moving_access) {
			
			// Переменная-флаг поиска незаконченной комбинации
			var done = false;

			// Попытка завершить незаконченную комбинацию для победы
			for (var i = 0; i < combo.length; i++) {
				if (map[combo[i][1]] * map[combo[i][2]] === Math.pow(pc, 2) && map[combo[i][0]] === 0) { map[combo[i][0]] = pc; done = true; break; }
				else if (map[combo[i][0]] * map[combo[i][2]] === Math.pow(pc, 2) && map[combo[i][1]] === 0) { map[combo[i][1]] = pc; done = true; break; }
				else if (map[combo[i][0]] * map[combo[i][1]] === Math.pow(pc, 2) && map[combo[i][2]] === 0) { map[combo[i][2]] = pc; done = true; break; }
			}

			// Если незаконченных победных комбинаций нет - попытка испортить победную комбинацию игроку
			if (!done)
				for (var i = 0; i < combo.length; i++) {
					if (map[combo[i][1]] * map[combo[i][2]] === Math.pow(human, 2) && map[combo[i][0]] === 0) { map[combo[i][0]] = pc; done = true; break; }
					else if (map[combo[i][0]] * map[combo[i][2]] === Math.pow(human, 2) && map[combo[i][1]] === 0) { map[combo[i][1]] = pc; done = true; break; }
					else if (map[combo[i][0]] * map[combo[i][1]] === Math.pow(human, 2) && map[combo[i][2]] === 0) { map[combo[i][2]] = pc; done = true; break; }
				}

			// Если и таких комбинаций нет - случайный ход
			if (!done) {
				var random = 0;
				do {
					random = Math.floor(Math.random() * map.length);
					for (var i = 0; i < map.length; i++)
						if (map[random] !== 0)
							random = 0;
				} while(!random);
				map[random] = pc;
			}

			sync();

			check_win(pc);
		}
	}
	
	// Ход игрока
	function human_move(cell) {
		
		// Ход возможен, только если клетка свободна и сам ход разрешен
		if (!map[cell] && moving_access) {
			map[cell] = human;
			sync();
			check_win(human);
			pc_move();
		}
	}
			
	// Синхронизация визуального поля с картой. Проставление крестиков и ноликов по ячейкам в соответствии с картой
	function sync() {
		for (var i = 0; i < map.length; i++)
			if (map[i]) document.querySelector(".cell" + i).innerHTML = map[i] === 1 ? "X" : "O";
	}
		
	
	
// ПОДПИСКА НА СОБЫТИЯ и МЕЛКИЕ ФУНКЦИИ
	
	// nod-лист с элементами - ячейками
	var cells = document.querySelectorAll(".cell");
	
	// Подписка ячеек...
	for (var i = 0; i < cells.length; i++) {
		
		// ...на событие клика мышью
		cells[i].addEventListener("click", function() {
			human_move(event.target.classList[1].replace(/\D/g, ''));
		});
		
		// ...на событие наведения курсора
		cells[i].addEventListener("mouseover", function() {
			if (document.querySelector("." + event.target.classList[1]).innerHTML === "")
				document.querySelector("." + event.target.classList[1]).style.boxShadow = "0 0 5px rgba(0,0,0,.8) inset";
		});
		
		// ...на событие отвода курсора
		cells[i].addEventListener("mouseout", function() {
			document.querySelector("." + event.target.classList[1]).style.boxShadow = "1px 1px 5px rgba(0,0,0,.5)";
		});
	}
	
	// Подписка кнопки "START" на событие клика мышью
	document.querySelector(".btn_start").addEventListener("click", function() {
		
		// Скрыть панель выбора крестика/нолика
		document.querySelector(".settings").style.display = "none";
		
		// Скрыть подложку
		document.querySelector(".black_wrap").style.display = "none";
		
		// Удаление информации о победителе
		document.querySelector(".winner").innerHTML = "";

		// Очистка поля и удаление анимации с ячеек
		for (var i = 0; i < cells.length; i++) {
			cells[i].innerHTML = "";
			cells[i].style.animation = "none";
			cells[i].style.WebkitAnimation = "none";
		}
		
		// Очистка карты
		for (var i = 0; i < map.length; i++) map[i] = 0;
		
		// Разрешение на ход
		moving_access = true;
		
		// Кто первый ходит
		if (document.querySelector(".radio_cross").checked) { human = 1; pc = 2; }
		else { pc = 1; human = 2; pc_move(); }
	});
	
	// Подписка кнопки "NEW GAME" на событие клика мышью
	document.querySelector(".btn_new").addEventListener("click", function() {
		
		// Отобразить панель выбора крестика/нолика
		document.querySelector(".settings").style.display = "flex";
		
		// Отобразить подложку
		document.querySelector(".black_wrap").style.display = "block";
		
		// Запрет на совершение хода
		moving_access = false;
		
	});
	
});