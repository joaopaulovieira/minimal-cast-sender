
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
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
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root.host) {
            return root;
        }
        return document;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function element_is(name, is) {
        return document.createElement(name, { is });
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = append_empty_stylesheet(node).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.42.1' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    const VIDEO_LIST = {
      mp4: {
        source: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/CastVideos/mp4/BigBuckBunny.mp4',
        mimeType: 'video/mp4',
      },
      hls: {
        source: 'https://multiplatform-f.akamaihd.net/i/multi/april11/sintel/sintel-hd_,512x288_450_b,640x360_700_b,768x432_1000_b,1024x576_1400_m,.mp4.csmil/master.m3u8',
        mimeType: 'application/x-mpegurl',
      },
      dash: {
        source: 'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd',
        mimeType: 'application/dash+xml',
      },
    };

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const defaultConfig = {
      source: VIDEO_LIST.mp4.source,
      mimeType: VIDEO_LIST.mp4.mimeType,
      receiverApplicationId : 'CC1AD845',
      autoJoinPolicy: 'origin_scoped',
      androidReceiverCompatible: true,
      startWithAutoPlay: true
    };

    let configStore = writable(defaultConfig);

    /* src/components/CastButton.svelte generated by Svelte v3.42.1 */

    const { console: console_1 } = globals;
    const file$6 = "src/components/CastButton.svelte";

    function create_fragment$6(ctx) {
    	let button;
    	let button_transition;
    	let current;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element_is("button", "google-cast-button");
    			attr_dev(button, "is", "google-cast-button");
    			attr_dev(button, "class", "svelte-1wp3zl3");
    			add_location(button, file$6, 65, 0, 2451);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "mousedown", /*setupCast*/ ctx[0], false, false, false),
    					listen_dev(button, "touchstart", /*setupCast*/ ctx[0], { passive: true }, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!button_transition) button_transition = create_bidirectional_transition(button, fade, { duration: 1000 }, true);
    				button_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!button_transition) button_transition = create_bidirectional_transition(button, fade, { duration: 1000 }, false);
    			button_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching && button_transition) button_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $configStore;
    	validate_store(configStore, 'configStore');
    	component_subscribe($$self, configStore, $$value => $$invalidate(1, $configStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CastButton', slots, []);

    	const setupRemotePlayer = () => {
    		console.log($configStore.receiverApplicationId);
    		let mediaInfo = new chrome.cast.media.MediaInfo($configStore.source, $configStore.mimeType);
    		mediaInfo.streamType = chrome.cast.media.StreamType.BUFFERED;
    		mediaInfo.metadata = new chrome.cast.media.TvShowMediaMetadata();
    		let request = new chrome.cast.media.LoadRequest(mediaInfo);
    		request.currentTime = 0;
    		request.autoplay = $configStore.startWithAutoPlay;
    		let session = cast.framework.CastContext.getInstance().getCurrentSession();
    		session.loadMedia(request).then(() => console.log('Remote media loaded'), errorCode => console.log('Remote media load error: ', errorCode));
    	};

    	const onReceiverConnectStateChanged = remotePlayer => {
    		if (cast && cast.framework && remotePlayer.isConnected) {
    			console.log('Receiver connected');
    			return setupRemotePlayer();
    		}

    		console.log('Receiver not connected');
    	};

    	const onMediaInfoChanged = ev => {
    		console.log('MEDIA_INFO_CHANGED event triggered: ', ev);

    		// Use the current session to get an up to date media status.
    		let session = cast.framework.CastContext.getInstance().getCurrentSession();

    		if (!session) return;
    		console.log('current session: ', session);

    		// Contains information about the playing media including currentTime.
    		let mediaStatus = session.getMediaSession();

    		if (!mediaStatus) return;
    		console.log('current mediaStatus: ', mediaStatus);

    		// mediaStatus also contains the mediaInfo containing metadata and other
    		// information about the in progress content.
    		let mediaInfo = mediaStatus.media;

    		console.log('current mediaInfo: ', mediaInfo);
    	};

    	const setupCast = () => {
    		cast.framework.CastContext.getInstance().setOptions($configStore);
    		const remotePlayer = new cast.framework.RemotePlayer();
    		window.receiverController = new cast.framework.RemotePlayerController(remotePlayer);

    		window.receiverController.addEventListener(cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED, () => {
    			onReceiverConnectStateChanged(remotePlayer);
    		});

    		window.receiverController.addEventListener(cast.framework.RemotePlayerEventType.MEDIA_INFO_CHANGED, onMediaInfoChanged);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<CastButton> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		fade,
    		configStore,
    		setupRemotePlayer,
    		onReceiverConnectStateChanged,
    		onMediaInfoChanged,
    		setupCast,
    		$configStore
    	});

    	return [setupCast];
    }

    class CastButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CastButton",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/components/Header.svelte generated by Svelte v3.42.1 */
    const file$5 = "src/components/Header.svelte";

    // (12:2) {:else}
    function create_else_block(ctx) {
    	let span;
    	let span_transition;
    	let current;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Cast Sender SDK is not available";
    			attr_dev(span, "class", "status-message light-red svelte-rpv21u");
    			add_location(span, file$5, 12, 4, 321);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!span_transition) span_transition = create_bidirectional_transition(span, fade, { duration: 1000 }, true);
    				span_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!span_transition) span_transition = create_bidirectional_transition(span, fade, { duration: 1000 }, false);
    			span_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching && span_transition) span_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(12:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (10:2) {#if castAvailabilityStatus}
    function create_if_block(ctx) {
    	let castbutton;
    	let current;
    	castbutton = new CastButton({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(castbutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(castbutton, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(castbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(castbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(castbutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(10:2) {#if castAvailabilityStatus}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let span;
    	let t1;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*castAvailabilityStatus*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "Minimal Cast Sender";
    			t1 = space();
    			if_block.c();
    			attr_dev(span, "class", "title");
    			add_location(span, file$5, 8, 2, 210);
    			attr_dev(div, "class", "header fl w-100 bg-dark-blue helvetica svelte-rpv21u");
    			add_location(div, file$5, 7, 0, 155);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(div, t1);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	let { castAvailabilityStatus = false } = $$props;
    	const writable_props = ['castAvailabilityStatus'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('castAvailabilityStatus' in $$props) $$invalidate(0, castAvailabilityStatus = $$props.castAvailabilityStatus);
    	};

    	$$self.$capture_state = () => ({ fade, CastButton, castAvailabilityStatus });

    	$$self.$inject_state = $$props => {
    		if ('castAvailabilityStatus' in $$props) $$invalidate(0, castAvailabilityStatus = $$props.castAvailabilityStatus);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [castAvailabilityStatus];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { castAvailabilityStatus: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get castAvailabilityStatus() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set castAvailabilityStatus(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Card.svelte generated by Svelte v3.42.1 */

    const file$4 = "src/components/Card.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "card b--solid bw1 br3 b--gray svelte-1bcgkri");
    			add_location(div, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/components/MediaList.svelte generated by Svelte v3.42.1 */
    const file$3 = "src/components/MediaList.svelte";

    function create_fragment$3(ctx) {
    	let h4;
    	let t1;
    	let div3;
    	let div0;
    	let input0;
    	let t2;
    	let label0;
    	let t4;
    	let div1;
    	let input1;
    	let t5;
    	let label1;
    	let t7;
    	let div2;
    	let input2;
    	let t8;
    	let label2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			h4.textContent = "Default Medias";
    			t1 = space();
    			div3 = element("div");
    			div0 = element("div");
    			input0 = element("input");
    			t2 = space();
    			label0 = element("label");
    			label0.textContent = "MP4 media";
    			t4 = space();
    			div1 = element("div");
    			input1 = element("input");
    			t5 = space();
    			label1 = element("label");
    			label1.textContent = "HLS media";
    			t7 = space();
    			div2 = element("div");
    			input2 = element("input");
    			t8 = space();
    			label2 = element("label");
    			label2.textContent = "DASH media";
    			attr_dev(h4, "class", "svelte-wjs1hr");
    			add_location(h4, file$3, 11, 0, 302);
    			attr_dev(input0, "type", "radio");
    			attr_dev(input0, "id", "mp4_video");
    			attr_dev(input0, "name", "option");
    			input0.value = JSON.stringify(VIDEO_LIST.mp4);
    			input0.checked = true;
    			attr_dev(input0, "class", "svelte-wjs1hr");
    			add_location(input0, file$3, 14, 4, 392);
    			attr_dev(label0, "for", "mp4_video");
    			add_location(label0, file$3, 21, 4, 576);
    			attr_dev(div0, "class", "videos-list__option svelte-wjs1hr");
    			add_location(div0, file$3, 13, 2, 354);
    			attr_dev(input1, "type", "radio");
    			attr_dev(input1, "id", "m3u8_video");
    			attr_dev(input1, "name", "option");
    			input1.value = JSON.stringify(VIDEO_LIST.hls);
    			attr_dev(input1, "class", "svelte-wjs1hr");
    			add_location(input1, file$3, 24, 4, 666);
    			attr_dev(label1, "for", "m3u8_video");
    			add_location(label1, file$3, 30, 4, 839);
    			attr_dev(div1, "class", "videos-list__option svelte-wjs1hr");
    			add_location(div1, file$3, 23, 2, 628);
    			attr_dev(input2, "type", "radio");
    			attr_dev(input2, "id", "mpd_video");
    			attr_dev(input2, "name", "option");
    			input2.value = JSON.stringify(VIDEO_LIST.dash);
    			attr_dev(input2, "class", "svelte-wjs1hr");
    			add_location(input2, file$3, 33, 4, 930);
    			attr_dev(label2, "for", "mpd_video");
    			add_location(label2, file$3, 39, 4, 1103);
    			attr_dev(div2, "class", "videos-list__option svelte-wjs1hr");
    			add_location(div2, file$3, 32, 2, 892);
    			attr_dev(div3, "class", "videos-list svelte-wjs1hr");
    			add_location(div3, file$3, 12, 0, 326);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, input0);
    			append_dev(div0, t2);
    			append_dev(div0, label0);
    			append_dev(div3, t4);
    			append_dev(div3, div1);
    			append_dev(div1, input1);
    			append_dev(div1, t5);
    			append_dev(div1, label1);
    			append_dev(div3, t7);
    			append_dev(div3, div2);
    			append_dev(div2, input2);
    			append_dev(div2, t8);
    			append_dev(div2, label2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input_handler*/ ctx[1], false, false, false),
    					listen_dev(input1, "input", /*input_handler_1*/ ctx[2], false, false, false),
    					listen_dev(input2, "input", /*input_handler_2*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div3);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $configStore;
    	validate_store(configStore, 'configStore');
    	component_subscribe($$self, configStore, $$value => $$invalidate(4, $configStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MediaList', slots, []);

    	const updateVideoConfig = media => {
    		const parsedMedia = JSON.parse(media);
    		const { source, mimeType } = parsedMedia;
    		set_store_value(configStore, $configStore = { ...$configStore, source, mimeType }, $configStore);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MediaList> was created with unknown prop '${key}'`);
    	});

    	const input_handler = e => updateVideoConfig(e.currentTarget.value);
    	const input_handler_1 = e => updateVideoConfig(e.currentTarget.value);
    	const input_handler_2 = e => updateVideoConfig(e.currentTarget.value);

    	$$self.$capture_state = () => ({
    		VIDEO_LIST,
    		configStore,
    		updateVideoConfig,
    		$configStore
    	});

    	return [updateVideoConfig, input_handler, input_handler_1, input_handler_2];
    }

    class MediaList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MediaList",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/components/CustomMediaConfig.svelte generated by Svelte v3.42.1 */
    const file$2 = "src/components/CustomMediaConfig.svelte";

    function create_fragment$2(ctx) {
    	let h4;
    	let t1;
    	let div0;
    	let span0;
    	let t3;
    	let input0;
    	let t4;
    	let div1;
    	let span1;
    	let t6;
    	let input1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			h4.textContent = "Custom Media";
    			t1 = space();
    			div0 = element("div");
    			span0 = element("span");
    			span0.textContent = "Media URL:";
    			t3 = space();
    			input0 = element("input");
    			t4 = space();
    			div1 = element("div");
    			span1 = element("span");
    			span1.textContent = "Mime Type:";
    			t6 = space();
    			input1 = element("input");
    			attr_dev(h4, "class", "svelte-1v83d4w");
    			add_location(h4, file$2, 4, 0, 74);
    			attr_dev(span0, "class", "svelte-1v83d4w");
    			add_location(span0, file$2, 6, 2, 128);
    			attr_dev(input0, "class", "svelte-1v83d4w");
    			add_location(input0, file$2, 7, 2, 154);
    			attr_dev(div0, "class", "input-container svelte-1v83d4w");
    			add_location(div0, file$2, 5, 0, 96);
    			attr_dev(span1, "class", "svelte-1v83d4w");
    			add_location(span1, file$2, 10, 2, 285);
    			attr_dev(input1, "placeholder", "'video/mp4' or 'application/x-mpegurl' and etc.");
    			attr_dev(input1, "class", "svelte-1v83d4w");
    			add_location(input1, file$2, 11, 2, 311);
    			attr_dev(div1, "class", "input-container svelte-1v83d4w");
    			add_location(div1, file$2, 9, 0, 253);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div0, anchor);
    			append_dev(div0, span0);
    			append_dev(div0, t3);
    			append_dev(div0, input0);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, span1);
    			append_dev(div1, t6);
    			append_dev(div1, input1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input_handler*/ ctx[1], false, false, false),
    					listen_dev(input1, "input", /*input_handler_1*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $configStore;
    	validate_store(configStore, 'configStore');
    	component_subscribe($$self, configStore, $$value => $$invalidate(0, $configStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CustomMediaConfig', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CustomMediaConfig> was created with unknown prop '${key}'`);
    	});

    	const input_handler = e => set_store_value(
    		configStore,
    		$configStore = {
    			...$configStore,
    			source: e.currentTarget.value
    		},
    		$configStore
    	);

    	const input_handler_1 = e => set_store_value(
    		configStore,
    		$configStore = {
    			...$configStore,
    			mimeType: e.currentTarget.value
    		},
    		$configStore
    	);

    	$$self.$capture_state = () => ({ configStore, $configStore });
    	return [$configStore, input_handler, input_handler_1];
    }

    class CustomMediaConfig extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CustomMediaConfig",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/components/ReceiverConfig.svelte generated by Svelte v3.42.1 */
    const file$1 = "src/components/ReceiverConfig.svelte";

    function create_fragment$1(ctx) {
    	let h4;
    	let t1;
    	let div0;
    	let span0;
    	let t3;
    	let input0;
    	let t4;
    	let div1;
    	let span1;
    	let t6;
    	let input1;
    	let t7;
    	let label0;
    	let t9;
    	let input2;
    	let t10;
    	let label1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			h4.textContent = "Receiver Config";
    			t1 = space();
    			div0 = element("div");
    			span0 = element("span");
    			span0.textContent = "App ID:";
    			t3 = space();
    			input0 = element("input");
    			t4 = space();
    			div1 = element("div");
    			span1 = element("span");
    			span1.textContent = "AutoPlay:";
    			t6 = space();
    			input1 = element("input");
    			t7 = space();
    			label0 = element("label");
    			label0.textContent = "True";
    			t9 = space();
    			input2 = element("input");
    			t10 = space();
    			label1 = element("label");
    			label1.textContent = "False";
    			attr_dev(h4, "class", "svelte-sn65no");
    			add_location(h4, file$1, 4, 0, 74);
    			attr_dev(span0, "class", "svelte-sn65no");
    			add_location(span0, file$1, 6, 2, 138);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Already using App ID 'CC1AD845'");
    			attr_dev(input0, "class", "svelte-sn65no");
    			add_location(input0, file$1, 7, 2, 161);
    			attr_dev(div0, "class", "app-id-input-container svelte-sn65no");
    			add_location(div0, file$1, 5, 0, 99);
    			attr_dev(span1, "class", "svelte-sn65no");
    			add_location(span1, file$1, 14, 2, 381);
    			attr_dev(input1, "type", "radio");
    			attr_dev(input1, "id", "autoplay_true");
    			attr_dev(input1, "name", "autoplay");
    			input1.value = true;
    			input1.checked = true;
    			attr_dev(input1, "class", "svelte-sn65no");
    			add_location(input1, file$1, 15, 2, 406);
    			attr_dev(label0, "for", "autoplay_true");
    			attr_dev(label0, "class", "svelte-sn65no");
    			add_location(label0, file$1, 22, 2, 575);
    			attr_dev(input2, "type", "radio");
    			attr_dev(input2, "id", "autoplay_false");
    			attr_dev(input2, "name", "autoplay");
    			input2.value = false;
    			attr_dev(input2, "class", "svelte-sn65no");
    			add_location(input2, file$1, 24, 2, 618);
    			attr_dev(label1, "for", "autoplay_false");
    			attr_dev(label1, "class", "svelte-sn65no");
    			add_location(label1, file$1, 30, 2, 784);
    			attr_dev(div1, "class", "autoplay-input-container svelte-sn65no");
    			add_location(div1, file$1, 13, 0, 340);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div0, anchor);
    			append_dev(div0, span0);
    			append_dev(div0, t3);
    			append_dev(div0, input0);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, span1);
    			append_dev(div1, t6);
    			append_dev(div1, input1);
    			append_dev(div1, t7);
    			append_dev(div1, label0);
    			append_dev(div1, t9);
    			append_dev(div1, input2);
    			append_dev(div1, t10);
    			append_dev(div1, label1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input_handler*/ ctx[1], false, false, false),
    					listen_dev(input1, "input", /*input_handler_1*/ ctx[2], false, false, false),
    					listen_dev(input2, "input", /*input_handler_2*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $configStore;
    	validate_store(configStore, 'configStore');
    	component_subscribe($$self, configStore, $$value => $$invalidate(0, $configStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ReceiverConfig', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ReceiverConfig> was created with unknown prop '${key}'`);
    	});

    	const input_handler = e => set_store_value(
    		configStore,
    		$configStore = {
    			...$configStore,
    			receiverApplicationId: e.currentTarget.value
    		},
    		$configStore
    	);

    	const input_handler_1 = e => set_store_value(configStore, $configStore = { ...$configStore, startWithAutoPlay: true }, $configStore);

    	const input_handler_2 = e => {
    		set_store_value(
    			configStore,
    			$configStore = {
    				...$configStore,
    				startWithAutoPlay: false
    			},
    			$configStore
    		);
    	};

    	$$self.$capture_state = () => ({ configStore, $configStore });
    	return [$configStore, input_handler, input_handler_1, input_handler_2];
    }

    class ReceiverConfig extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ReceiverConfig",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.42.1 */
    const file = "src/App.svelte";

    // (17:1) <Card --cardMaxWidth='50%'>
    function create_default_slot_2(ctx) {
    	let receiverconfig;
    	let current;
    	receiverconfig = new ReceiverConfig({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(receiverconfig.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(receiverconfig, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(receiverconfig.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(receiverconfig.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(receiverconfig, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(17:1) <Card --cardMaxWidth='50%'>",
    		ctx
    	});

    	return block;
    }

    // (20:1) <Card --cardMaxWidth='50%'>
    function create_default_slot_1(ctx) {
    	let medialist;
    	let current;
    	medialist = new MediaList({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(medialist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(medialist, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(medialist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(medialist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(medialist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(20:1) <Card --cardMaxWidth='50%'>",
    		ctx
    	});

    	return block;
    }

    // (23:1) <Card --cardMaxWidth='50%'>
    function create_default_slot(ctx) {
    	let custommediaconfig;
    	let current;
    	custommediaconfig = new CustomMediaConfig({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(custommediaconfig.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(custommediaconfig, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(custommediaconfig.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(custommediaconfig.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(custommediaconfig, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(23:1) <Card --cardMaxWidth='50%'>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let header;
    	let t0;
    	let main;
    	let card0;
    	let div;
    	let t1;
    	let card1;
    	let div_1;
    	let t2;
    	let card2;
    	let div_2;
    	let current;

    	header = new Header({
    			props: {
    				castAvailabilityStatus: /*castAvailabilityStatus*/ ctx[0]
    			},
    			$$inline: true
    		});

    	card0 = new Card({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card1 = new Card({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card2 = new Card({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			main = element("main");
    			div = element("div");
    			create_component(card0.$$.fragment);
    			t1 = space();
    			div_1 = element("div");
    			create_component(card1.$$.fragment);
    			t2 = space();
    			div_2 = element("div");
    			create_component(card2.$$.fragment);
    			set_style(div, "display", "contents");
    			set_style(div, "--cardMaxWidth", "50%");
    			set_style(div_1, "display", "contents");
    			set_style(div_1, "--cardMaxWidth", "50%");
    			set_style(div_2, "display", "contents");
    			set_style(div_2, "--cardMaxWidth", "50%");
    			attr_dev(main, "class", "content helvetica");
    			add_location(main, file, 15, 0, 473);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			mount_component(card0, div, null);
    			append_dev(main, t1);
    			append_dev(main, div_1);
    			mount_component(card1, div_1, null);
    			append_dev(main, t2);
    			append_dev(main, div_2);
    			mount_component(card2, div_2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const header_changes = {};
    			if (dirty & /*castAvailabilityStatus*/ 1) header_changes.castAvailabilityStatus = /*castAvailabilityStatus*/ ctx[0];
    			header.$set(header_changes);
    			const card0_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				card0_changes.$$scope = { dirty, ctx };
    			}

    			card0.$set(card0_changes);
    			const card1_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				card1_changes.$$scope = { dirty, ctx };
    			}

    			card1.$set(card1_changes);
    			const card2_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				card2_changes.$$scope = { dirty, ctx };
    			}

    			card2.$set(card2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(card0.$$.fragment, local);
    			transition_in(card1.$$.fragment, local);
    			transition_in(card2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(card0.$$.fragment, local);
    			transition_out(card1.$$.fragment, local);
    			transition_out(card2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(card0);
    			destroy_component(card1);
    			destroy_component(card2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let castAvailabilityStatus = false;

    	window['__onGCastApiAvailable'] = isAvailable => {
    		$$invalidate(0, castAvailabilityStatus = isAvailable);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Header,
    		Card,
    		MediaList,
    		CustomMediaConfig,
    		ReceiverConfig,
    		castAvailabilityStatus
    	});

    	$$self.$inject_state = $$props => {
    		if ('castAvailabilityStatus' in $$props) $$invalidate(0, castAvailabilityStatus = $$props.castAvailabilityStatus);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [castAvailabilityStatus];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({ target: document.body });

    return app;

}());
//# sourceMappingURL=bundle.js.map
