<script lang="ts">
	let isCodeShow = $state(false);

	interface IProps {
		code: string;
		codeOnClick?: () => void;
		onCodeFormated: (v: string) => void;
		_class?: string;
	}

	let {
		code = '',
		codeOnClick = () => {},
		onCodeFormated = (v: string) => {
			v = code;
		},
		_class
	}: IProps = $props();

	function formatCode(v: string) {
		let tab = '\t';
		let result = '';
		let indent = '';

		v.split(/>\s*</).forEach((e: string) => {
			if (e.match(/^\/\w/)) {
				indent = indent.substring(tab.length);
			}
			result += indent + '<' + e + '>\r\n';
			if (e.match(/^<?\w[^>]*[^\/]$/) && !e.startsWith('input')) {
				indent += tab;
			}
		});

		onCodeFormated(result.substring(1, result.length - 3));
	}
</script>

<div class={_class}>
	{#if !isCodeShow}
		<!--Отменить, Повторить-->
		<div class="btn-group btn-group-sm me-1">
			<button
				aria-label=""
				class="btn btn-light text-dark"
				title="Отменить"
				onclick={() => document.execCommand('undo')}><i class="fas fa-undo" /></button>
			<button
				aria-label=""
				class="btn btn-light text-dark"
				title="Повторить"
				onclick={() => document.execCommand('redo')}><i class="fas fa-redo" /></button>
		</div>
		<!--Стили-->
		<div class="btn-group btn-group-sm me-1">
			<div class="dropdown d-inline">
				<button
					class="btn btn-sm btn-light text-dark dropdown-toggle"
					data-bs-toggle="dropdown"
					title="Стиль текста">
					Обычный
				</button>
				<div class="dropdown-menu">
					<button
						class="dropdown-item"
						onclick={() => document.execCommand('formatBlock', false, 'P')}>Обычный</button>
					<button
						class="dropdown-item"
						onclick={() => document.execCommand('formatBlock', false, 'H1')}
						><h1>Заголовок 1</h1></button>
					<button
						class="dropdown-item"
						onclick={() => document.execCommand('formatBlock', false, 'H2')}
						><h2>Заголовок 2</h2></button>
					<button
						class="dropdown-item"
						onclick={() => document.execCommand('formatBlock', false, 'H3')}
						><h3>Заголовок 3</h3></button>
					<button
						class="dropdown-item"
						onclick={() => document.execCommand('formatBlock', false, 'H4')}
						><h4>Заголовок 4</h4></button>
					<button
						class="dropdown-item"
						onclick={() => document.execCommand('formatBlock', false, 'H5')}
						><h5>Заголовок 5</h5></button>
					<button
						class="dropdown-item"
						onclick={() => document.execCommand('formatBlock', false, 'H6')}
						><h6>Заголовок 6</h6></button>
				</div>
			</div>
		</div>
		<!--Названия шрифтов-->
		<div class="btn-group btn-group-sm me-1">
			<div class="dropdown d-inline">
				<button
					class="btn btn-sm btn-light text-dark dropdown-toggle"
					data-bs-toggle="dropdown"
					title="Название шрифта">
					Segoe UI
				</button>
				<div class="dropdown-menu">
					<button
						class="dropdown-item"
						style="font-family:Arial"
						onclick={() => document.execCommand('fontName', false, 'Arial')}>Arial</button>
					<button
						class="dropdown-item"
						style="font-family:Consolas"
						onclick={() => document.execCommand('fontName', false, 'Consolas')}>Consolas</button>
					<button
						class="dropdown-item"
						style="font-family:'Roboto'"
						onclick={() => document.execCommand('fontName', false, 'Roboto')}>Roboto</button>
					<button
						class="dropdown-item"
						style="font-family:'Segoe UI'"
						onclick={() => document.execCommand('fontName', false, 'Segoe UI')}>Segoe UI</button>
					<button
						class="dropdown-item"
						style="font-family:'Times New Roman'"
						onclick={() => document.execCommand('fontName', false, 'Times New Roman')}
						>Times N.R.</button>
				</div>
			</div>
		</div>
		<!--Размер шрифтов-->
		<div class="btn-group btn-group-sm me-1">
			<div class="dropdown d-inline">
				<button
					class="btn btn-sm btn-light text-dark dropdown-toggle"
					data-bs-toggle="dropdown"
					title="Размер шрифта">
					14 pt
				</button>
				<div class="dropdown-menu">
					<button class="dropdown-item" onclick={() => document.execCommand('fontSize', false, '1')}
						>10 pt</button>
					<button class="dropdown-item" onclick={() => document.execCommand('fontSize', false, '2')}
						>12 pt</button>
					<button class="dropdown-item" onclick={() => document.execCommand('fontSize', false, '3')}
						>14 pt</button>
					<button class="dropdown-item" onclick={() => document.execCommand('fontSize', false, '4')}
						>16 pt</button>
					<button class="dropdown-item" onclick={() => document.execCommand('fontSize', false, '5')}
						>18 pt</button>
					<button class="dropdown-item" onclick={() => document.execCommand('fontSize', false, '6')}
						>22 pt</button>
					<button class="dropdown-item" onclick={() => document.execCommand('fontSize', false, '7')}
						>24 pt</button>
				</div>
			</div>
		</div>
		<!--Жирный, курсив, подчёркнутый-->
		<div class="btn-group btn-group-sm me-1">
			<button
				aria-label=""
				class="btn btn-light text-dark"
				title="Жирный"
				onclick={() => document.execCommand('bold')}><i class="fas fa-bold" /></button>
			<button
				aria-label=""
				class="btn btn-light text-dark"
				title="Курсив"
				onclick={() => document.execCommand('italic')}><i class="fas fa-italic" /></button>
			<button
				aria-label=""
				class="btn btn-light text-dark"
				title="Подчёркнутый"
				onclick={() => document.execCommand('underline')}><i class="fas fa-underline" /></button>
		</div>
		<!--Выравнивание текста-->
		<div class="btn-group btn-group-sm me-1" data-bs-toggle="buttons">
			<label class="btn btn-light text-dark active" title="Слева">
				<input
					type="radio"
					name="options"
					id="option1"
					autocomplete="off"
					checked
					onclick={() => document.execCommand('justifyLeft')} />
				<i class="fas fa-align-left" />
			</label>
			<label class="btn btn-light text-dark" title="По центру">
				<input
					type="radio"
					name="options"
					id="option2"
					autocomplete="off"
					onclick={() => document.execCommand('justifyCenter')} />
				<i class="fas fa-align-center" />
			</label>
			<label class="btn btn-light text-dark" title="Справа">
				<input
					type="radio"
					name="options"
					id="option3"
					autocomplete="off"
					onclick={() => document.execCommand('justifyRight')} />
				<i class="fas fa-align-right" />
			</label>
			<label class="btn btn-light text-dark" title="По ширине">
				<input
					type="radio"
					name="options"
					id="option4"
					autocomplete="off"
					onclick={() => document.execCommand('justifyFull')} />
				<i class="fas fa-align-justify" />
			</label>
		</div>
		<!--Списки-->
		<div class="btn-group btn-group-sm me-1">
			<button
				aria-label=""
				class="btn btn-light text-dark"
				onclick={() => document.execCommand('insertOrderedList')}
				><i class="fas fa-list-ol" /></button>
			<button
				aria-label=""
				class="btn btn-light text-dark"
				onclick={() => document.execCommand('insertUnorderedList')}
				><i class="fas fa-list-ul" /></button>
		</div>
	{/if}

	<button
		class="btn btn-sm btn-light text-dark"
		title={isCodeShow ? 'Скрыть код' : 'Показать код'}
		onclick={() => {
			codeOnClick();
			isCodeShow = !isCodeShow;
		}}
		>{#if isCodeShow}
			<i class="fa-regular fa-file-lines" />
		{:else}
			<i class="fa-solid fa-code" />
		{/if}
	</button>
	{#if isCodeShow}
		<button class="btn btn-sm btn-light text-dark" onclick={() => formatCode(code)}
			>Форматировать код</button>
	{/if}
</div>
