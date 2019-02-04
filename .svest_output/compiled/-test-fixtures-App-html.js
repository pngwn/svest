'use strict';

function noop() {}

function run(fn) {
	return fn();
}

function blankObject() {
	return Object.create(null);
}

function run_all(fns) {
	fns.forEach(run);
}

function is_function(thing) {
	return typeof thing === 'function';
}

function safe_not_equal(a, b) {
	return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

function append(target, node) {
	target.appendChild(node);
}

function insert(target, node, anchor) {
	target.insertBefore(node, anchor);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

function createElement(name) {
	return document.createElement(name);
}

function createText(data) {
	return document.createTextNode(data);
}

function addListener(node, event, handler, options) {
	node.addEventListener(event, handler, options);
	return () => node.removeEventListener(event, handler, options);
}

function children (element) {
	return Array.from(element.childNodes);
}

function setData(text, data) {
	text.data = '' + data;
}

let current_component;

function set_current_component(component) {
	current_component = component;
}

function get_current_component() {
	if (!current_component) throw new Error(`Function called outside component initialization`);
	return current_component;
}

function afterUpdate(fn) {
	get_current_component().$$.after_render.push(fn);
}

let dirty_components = [];

let update_promise;
const binding_callbacks = [];
const render_callbacks = [];

function schedule_update() {
	if (!update_promise) {
		update_promise = Promise.resolve();
		update_promise.then(flush);
	}
}

function add_render_callback(fn) {
	render_callbacks.push(fn);
}

function add_binding_callback(fn) {
	binding_callbacks.push(fn);
}

function flush() {
	const seen_callbacks = new Set();

	do {
		// first, call beforeUpdate functions
		// and update components
		while (dirty_components.length) {
			const component = dirty_components.shift();
			set_current_component(component);
			update(component.$$);
		}

		while (binding_callbacks.length) binding_callbacks.shift()();

		// then, once components are updated, call
		// afterUpdate functions. This may cause
		// subsequent updates...
		while (render_callbacks.length) {
			const callback = render_callbacks.pop();
			if (!seen_callbacks.has(callback)) {
				callback();

				// ...so guard against infinite loops
				seen_callbacks.add(callback);
			}
		}
	} while (dirty_components.length);

	update_promise = null;
}

function update($$) {
	if ($$.fragment) {
		$$.update($$.dirty);
		run_all($$.before_render);
		$$.fragment.p($$.dirty, $$.ctx);
		$$.dirty = null;

		$$.after_render.forEach(add_render_callback);
	}
}

function mount_component(component, target, anchor) {
	const { fragment, on_mount, on_destroy, after_render } = component.$$;

	fragment.m(target, anchor);

	// onMount happens after the initial afterUpdate. Because
	// afterUpdate callbacks happen in reverse order (inner first)
	// we schedule onMount callbacks before afterUpdate callbacks
	add_render_callback(() => {
		const new_on_destroy = on_mount.map(run).filter(is_function);
		if (on_destroy) {
			on_destroy.push(...new_on_destroy);
		} else {
			// Edge case — component was destroyed immediately,
			// most likely as a result of a binding initialising
			run_all(new_on_destroy);
		}
		component.$$.on_mount = [];
	});

	after_render.forEach(add_render_callback);
}

function destroy(component, detach) {
	if (component.$$) {
		run_all(component.$$.on_destroy);
		component.$$.fragment.d(detach);

		// TODO null out other refs, including component.$$ (but need to
		// preserve final state?)
		component.$$.on_destroy = component.$$.fragment = null;
		component.$$.ctx = {};
	}
}

function make_dirty(component, key) {
	if (!component.$$.dirty) {
		dirty_components.push(component);
		schedule_update();
		component.$$.dirty = {};
	}
	component.$$.dirty[key] = true;
}

function init(component, options, instance, create_fragment, not_equal$$1) {
	const parent_component = current_component;
	set_current_component(component);

	const props = options.props || {};

	const $$ = component.$$ = {
		fragment: null,
		ctx: null,

		// state
		update: noop,
		not_equal: not_equal$$1,
		bound: blankObject(),

		// lifecycle
		on_mount: [],
		on_destroy: [],
		before_render: [],
		after_render: [],
		context: new Map(parent_component ? parent_component.$$.context : []),

		// everything else
		callbacks: blankObject(),
		dirty: null
	};

	let ready = false;

	$$.ctx = instance
		? instance(component, props, (key, value) => {
			if ($$.bound[key]) $$.bound[key](value);

			if ($$.ctx) {
				const changed = not_equal$$1(value, $$.ctx[key]);
				if (ready && changed) {
					make_dirty(component, key);
				}

				$$.ctx[key] = value;
				return changed;
			}
		})
		: props;

	$$.update();
	ready = true;
	run_all($$.before_render);
	$$.fragment = create_fragment($$.ctx);

	if (options.target) {
		if (options.hydrate) {
			$$.fragment.l(children(options.target));
		} else {
			$$.fragment.c();
		}

		if (options.intro && component.$$.fragment.i) component.$$.fragment.i();
		mount_component(component, options.target, options.anchor);
		flush();
	}

	set_current_component(parent_component);
}

class SvelteComponent {
	$destroy() {
		destroy(this, true);
		this.$destroy = noop;
	}

	$on(type, callback) {
		const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
		callbacks.push(callback);

		return () => {
			const index = callbacks.indexOf(callback);
			if (index !== -1) callbacks.splice(index, 1);
		};
	}

	$set() {
		// overridden by instance, if it has props
	}
}

/* test/fixtures/App.html generated by Svelte v3.0.0-alpha27 */

function create_fragment(ctx) {
	var input_1, text0, p_1, text1, text2_value = ctx.name || 'stranger', text2, text3, text4, button_1, dispose;

	return {
		c() {
			input_1 = createElement("input");
			text0 = createText("\n");
			p_1 = createElement("p");
			text1 = createText("Hello ");
			text2 = createText(text2_value);
			text3 = createText("!");
			text4 = createText("\n");
			button_1 = createElement("button");
			button_1.textContent = "Click me";
			input_1.placeholder = "enter your name";

			dispose = [
				addListener(input_1, "input", ctx.input_1_input_handler),
				addListener(button_1, "click", ctx.click)
			];
		},

		m(target, anchor) {
			insert(target, input_1, anchor);

			input_1.value = ctx.name;

			add_binding_callback(() => ctx.input_1_binding(input_1, null));
			insert(target, text0, anchor);
			insert(target, p_1, anchor);
			append(p_1, text1);
			append(p_1, text2);
			append(p_1, text3);
			add_binding_callback(() => ctx.p_1_binding(p_1, null));
			insert(target, text4, anchor);
			insert(target, button_1, anchor);
			add_binding_callback(() => ctx.button_1_binding(button_1, null));
		},

		p(changed, ctx) {
			if (changed.name) input_1.value = ctx.name;
			if (changed.items) {
				ctx.input_1_binding(null, input_1);
				ctx.input_1_binding(input_1, null);
			}

			if ((changed.name) && text2_value !== (text2_value = ctx.name || 'stranger')) {
				setData(text2, text2_value);
			}

			if (changed.items) {
				ctx.p_1_binding(null, p_1);
				ctx.p_1_binding(p_1, null);
			}
			if (changed.items) {
				ctx.button_1_binding(null, button_1);
				ctx.button_1_binding(button_1, null);
			}
		},

		i: noop,
		o: noop,

		d(detach) {
			if (detach) {
				detachNode(input_1);
			}

			ctx.input_1_binding(null, input_1);

			if (detach) {
				detachNode(text0);
				detachNode(p_1);
			}

			ctx.p_1_binding(null, p_1);

			if (detach) {
				detachNode(text4);
				detachNode(button_1);
			}

			ctx.button_1_binding(null, button_1);
			run_all(dispose);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let name = '',
    input,
    button,
    p;
  function click() {
    name = 'Benjamin'; $$invalidate('name', name);
  }
      afterUpdate(() => {
        window.vars = { name, input, button, p, click };
      });

	function input_1_input_handler() {
		name = this.value;
		$$invalidate('name', name);
	}

	function input_1_binding($$node, check) {
		input = $$node;
		$$invalidate('input', input);
	}

	function p_1_binding($$node, check) {
		p = $$node;
		$$invalidate('p', p);
	}

	function button_1_binding($$node, check) {
		button = $$node;
		$$invalidate('button', button);
	}

	return {
		name,
		input,
		button,
		p,
		click,
		input_1_input_handler,
		input_1_binding,
		p_1_binding,
		button_1_binding
	};
}

class App extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal);
	}
}

module.exports = App;
//# sourceMappingURL=-test-fixtures-App-html.js.map
