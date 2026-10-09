window.__ModuleLoader__.load({
	id: "dsh-firefly-assistant",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_jsx_runtime = require("react/jsx-runtime");
		let _deepseek_ai_dsh_client_runtime_client = require("@deepseek-ai/dsh-client-runtime/client");
		//#region ../../../../vendor/cosmokit/lib/index.js
		/** Return true when a value is `null` or `undefined`. */
		function isNullable(value) {
			return value === null || value === void 0;
		}
		/** Return true for non-array object values. */
		function isPlainObject(data) {
			return data && typeof data === "object" && !Array.isArray(data);
		}
		/** Filter object entries and return a new object. */
		function filterKeys(object, filter) {
			return Object.fromEntries(Object.entries(object).filter(([key, value]) => filter(key, value)));
		}
		/** Map object values while preserving the original key set. */
		function mapValues(object, transform) {
			return Object.fromEntries(Object.entries(object).map(([key, value]) => [key, transform(value, key)]));
		}
		/** Pick selected keys from an object, optionally including `undefined` values. */
		function pick(source, keys, forced) {
			if (!keys) return { ...source };
			const result = {};
			for (const key of keys) if (forced || source[key] !== void 0) result[key] = source[key];
			return result;
		}
		/** Test values using `instanceof` with a `toStringTag` fallback. */
		function is(type, value) {
			if (arguments.length === 1) return (value) => is(type, value);
			return type in globalThis && value instanceof globalThis[type] || Object.prototype.toString.call(value).slice(8, -1) === type;
		}
		function isArrayBufferLike(value) {
			return is("ArrayBuffer", value) || is("SharedArrayBuffer", value);
		}
		function isArrayBufferSource(value) {
			return isArrayBufferLike(value) || ArrayBuffer.isView(value);
		}
		/** Binary source detection and base64/hex conversion helpers. */
		var Binary;
		(function(Binary) {
			Binary.is = isArrayBufferLike;
			Binary.isSource = isArrayBufferSource;
			function fromSource(source) {
				if (ArrayBuffer.isView(source)) return source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
				else return source;
			}
			Binary.fromSource = fromSource;
			function toBase64(source) {
				source = fromSource(source);
				if (typeof Buffer !== "undefined") return Buffer.from(source).toString("base64");
				let binary = "";
				const bytes = new Uint8Array(source);
				for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
				return btoa(binary);
			}
			Binary.toBase64 = toBase64;
			function fromBase64(source) {
				if (typeof Buffer !== "undefined") return fromSource(Buffer.from(source, "base64"));
				return Uint8Array.from(atob(source), (c) => c.charCodeAt(0));
			}
			Binary.fromBase64 = fromBase64;
			function toHex(source) {
				source = fromSource(source);
				if (typeof Buffer !== "undefined") return Buffer.from(source).toString("hex");
				return Array.from(new Uint8Array(source), (byte) => byte.toString(16).padStart(2, "0")).join("");
			}
			Binary.toHex = toHex;
			function fromHex(source) {
				if (typeof Buffer !== "undefined") return fromSource(Buffer.from(source, "hex"));
				const hex = source.length % 2 === 0 ? source : source.slice(0, source.length - 1);
				const buffer = [];
				for (let i = 0; i < hex.length; i += 2) buffer.push(parseInt(`${hex[i]}${hex[i + 1]}`, 16));
				return Uint8Array.from(buffer).buffer;
			}
			Binary.fromHex = fromHex;
		})(Binary || (Binary = {}));
		Binary.fromBase64;
		Binary.toBase64;
		Binary.fromHex;
		Binary.toHex;
		/** Deep-clone common JavaScript values while preserving prototypes and cycles. */
		function clone(source, refs = /* @__PURE__ */ new Map()) {
			if (!source || typeof source !== "object") return source;
			if (is("Date", source)) return new Date(source.valueOf());
			if (is("RegExp", source)) return new RegExp(source.source, source.flags);
			if (isArrayBufferLike(source)) return source.slice(0);
			if (ArrayBuffer.isView(source)) return source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
			const cached = refs.get(source);
			if (cached) return cached;
			if (Array.isArray(source)) {
				const result = [];
				refs.set(source, result);
				source.forEach((value, index) => {
					result[index] = Reflect.apply(clone, null, [value, refs]);
				});
				return result;
			}
			const result = Object.create(Object.getPrototypeOf(source));
			refs.set(source, result);
			for (const key of Reflect.ownKeys(source)) {
				const descriptor = { ...Reflect.getOwnPropertyDescriptor(source, key) };
				if ("value" in descriptor) descriptor.value = Reflect.apply(clone, null, [descriptor.value, refs]);
				Reflect.defineProperty(result, key, descriptor);
			}
			return result;
		}
		/** Deeply compare arrays, dates, regexps, buffers, and plain object fields. */
		function deepEqual(a, b, strict) {
			if (a === b) return true;
			if (!strict && isNullable(a) && isNullable(b)) return true;
			if (typeof a !== typeof b) return false;
			if (typeof a !== "object") return false;
			if (!a || !b) return false;
			function check(test, then) {
				return test(a) ? test(b) ? then(a, b) : false : test(b) ? false : void 0;
			}
			return check(Array.isArray, (a, b) => a.length === b.length && a.every((item, index) => deepEqual(item, b[index]))) ?? check(is("Date"), (a, b) => a.valueOf() === b.valueOf()) ?? check(is("RegExp"), (a, b) => a.source === b.source && a.flags === b.flags) ?? check(isArrayBufferLike, (a, b) => {
				if (a.byteLength !== b.byteLength) return false;
				const viewA = new Uint8Array(a);
				const viewB = new Uint8Array(b);
				for (let i = 0; i < viewA.length; i++) if (viewA[i] !== viewB[i]) return false;
				return true;
			}) ?? Object.keys({
				...a,
				...b
			}).every((key) => deepEqual(a[key], b[key], strict));
		}
		/** Time constants plus parsing and formatting helpers. */
		var Time;
		(function(Time) {
			Time.millisecond = 1;
			Time.second = 1e3;
			Time.minute = Time.second * 60;
			Time.hour = Time.minute * 60;
			Time.day = Time.hour * 24;
			Time.week = Time.day * 7;
			let timezoneOffset = (/* @__PURE__ */ new Date()).getTimezoneOffset();
			function setTimezoneOffset(offset) {
				timezoneOffset = offset;
			}
			Time.setTimezoneOffset = setTimezoneOffset;
			function getTimezoneOffset() {
				return timezoneOffset;
			}
			Time.getTimezoneOffset = getTimezoneOffset;
			function getDateNumber(date = /* @__PURE__ */ new Date(), offset) {
				if (typeof date === "number") date = new Date(date);
				if (offset === void 0) offset = timezoneOffset;
				return Math.floor((date.valueOf() / Time.minute - offset) / 1440);
			}
			Time.getDateNumber = getDateNumber;
			function fromDateNumber(value, offset) {
				const date = new Date(value * Time.day);
				if (offset === void 0) offset = timezoneOffset;
				return new Date(+date + offset * Time.minute);
			}
			Time.fromDateNumber = fromDateNumber;
			const numeric = /\d+(?:\.\d+)?/.source;
			const timeRegExp = new RegExp(`^${[
				"w(?:eek(?:s)?)?",
				"d(?:ay(?:s)?)?",
				"h(?:our(?:s)?)?",
				"m(?:in(?:ute)?(?:s)?)?",
				"s(?:ec(?:ond)?(?:s)?)?"
			].map((unit) => `(${numeric}${unit})?`).join("")}$`);
			function parseTime(source) {
				const capture = timeRegExp.exec(source);
				if (!capture) return 0;
				return (parseFloat(capture[1]) * Time.week || 0) + (parseFloat(capture[2]) * Time.day || 0) + (parseFloat(capture[3]) * Time.hour || 0) + (parseFloat(capture[4]) * Time.minute || 0) + (parseFloat(capture[5]) * Time.second || 0);
			}
			Time.parseTime = parseTime;
			function parseDate(date) {
				const parsed = parseTime(date);
				if (parsed) date = Date.now() + parsed;
				else if (/^\d{1,2}(:\d{1,2}){1,2}$/.test(date)) date = `${(/* @__PURE__ */ new Date()).toLocaleDateString()}-${date}`;
				else if (/^\d{1,2}-\d{1,2}-\d{1,2}(:\d{1,2}){1,2}$/.test(date)) date = `${(/* @__PURE__ */ new Date()).getFullYear()}-${date}`;
				return date ? new Date(date) : /* @__PURE__ */ new Date();
			}
			Time.parseDate = parseDate;
			function format(ms) {
				const abs = Math.abs(ms);
				if (abs >= Time.day - Time.hour / 2) return Math.round(ms / Time.day) + "d";
				else if (abs >= Time.hour - Time.minute / 2) return Math.round(ms / Time.hour) + "h";
				else if (abs >= Time.minute - Time.second / 2) return Math.round(ms / Time.minute) + "m";
				else if (abs >= Time.second) return Math.round(ms / Time.second) + "s";
				return ms + "ms";
			}
			Time.format = format;
			function toDigits(source, length = 2) {
				return source.toString().padStart(length, "0");
			}
			Time.toDigits = toDigits;
			function template(template, time = /* @__PURE__ */ new Date()) {
				return template.replace("yyyy", time.getFullYear().toString()).replace("yy", time.getFullYear().toString().slice(2)).replace("MM", toDigits(time.getMonth() + 1)).replace("dd", toDigits(time.getDate())).replace("hh", toDigits(time.getHours())).replace("mm", toDigits(time.getMinutes())).replace("ss", toDigits(time.getSeconds())).replace("SSS", toDigits(time.getMilliseconds(), 3));
			}
			Time.template = template;
		})(Time || (Time = {}));
		//#endregion
		//#region ../../../../vendor/schemastery/lib/index.mjs
		const kSchema = Symbol.for("schemastery");
		const kValidationError = Symbol.for("ValidationError");
		globalThis.__schemastery_index__ ??= 0;
		globalThis.__schemastery_refs__ = void 0;
		var ValidationError = class extends TypeError {
			options;
			name = "ValidationError";
			constructor(message, options) {
				let prefix = "$";
				for (const segment of options.path || []) if (typeof segment === "string") prefix += "." + segment;
				else if (typeof segment === "number") prefix += "[" + segment + "]";
				else if (typeof segment === "symbol") prefix += `[Symbol(${segment.toString()})]`;
				if (prefix.startsWith(".")) prefix = prefix.slice(1);
				super((prefix === "$" ? "" : `${prefix} `) + message);
				this.options = options;
			}
			static is(error) {
				return !!error?.[kValidationError];
			}
		};
		Object.defineProperty(ValidationError.prototype, kValidationError, { value: true });
		const Schema = function(options) {
			const schema = function(data, options = {}) {
				return Schema.resolve(data, schema, options)[0];
			};
			if (options.refs) {
				const refs = mapValues(options.refs, (options) => new Schema(options));
				const getRef = (uid) => refs[uid];
				for (const key in refs) {
					const options = refs[key];
					options.sKey = getRef(options.sKey);
					options.inner = getRef(options.inner);
					options.list = options.list && options.list.map(getRef);
					options.dict = options.dict && mapValues(options.dict, getRef);
				}
				return refs[options.uid];
			}
			Object.assign(schema, options);
			if (typeof schema.callback === "string") try {
				schema.callback = new Function("return " + schema.callback)();
			} catch {}
			Object.defineProperty(schema, "uid", { value: globalThis.__schemastery_index__++ });
			Object.setPrototypeOf(schema, Schema.prototype);
			schema.meta ||= {};
			schema.toString = schema.toString.bind(schema);
			return schema;
		};
		Schema.prototype = Object.create(Function.prototype);
		Schema.prototype[kSchema] = true;
		Object.defineProperty(Schema.prototype, "~standard", { get() {
			return {
				version: 1,
				vendor: "schemastery",
				validate: (value) => {
					try {
						return { value: Schema.resolve(value, this, {})[0] };
					} catch (error) {
						if (ValidationError.is(error)) return { issues: [{
							message: error.message,
							path: error.options.path
						}] };
						throw error;
					}
				}
			};
		} });
		Schema.ValidationError = ValidationError;
		Schema.prototype.toJSON = function toJSON() {
			if (globalThis.__schemastery_refs__) {
				globalThis.__schemastery_refs__[this.uid] ??= JSON.parse(JSON.stringify({ ...this }));
				return this.uid;
			}
			globalThis.__schemastery_refs__ = { [this.uid]: { ...this } };
			globalThis.__schemastery_refs__[this.uid] = JSON.parse(JSON.stringify({ ...this }));
			const result = {
				uid: this.uid,
				refs: globalThis.__schemastery_refs__
			};
			globalThis.__schemastery_refs__ = void 0;
			return result;
		};
		Schema.prototype.set = function set(key, value) {
			this.dict[key] = value;
			return this;
		};
		Schema.prototype.push = function push(value) {
			this.list.push(value);
			return this;
		};
		function mergeDesc(original, messages) {
			const result = typeof original === "string" ? { "": original } : { ...original };
			for (const locale in messages) {
				const value = messages[locale];
				if (value?.$description || value?.$desc) result[locale] = value.$description || value.$desc;
				else if (typeof value === "string") result[locale] = value;
			}
			return result;
		}
		function getInner(value) {
			return value?.$value ?? value?.$inner;
		}
		function extractKeys(data) {
			return filterKeys(data ?? {}, (key) => !key.startsWith("$"));
		}
		Schema.prototype.i18n = function i18n(messages) {
			const schema = Schema(this);
			const desc = mergeDesc(schema.meta.description, messages);
			if (Object.keys(desc).length) schema.meta.description = desc;
			if (schema.dict) schema.dict = mapValues(schema.dict, (inner, key) => {
				return inner.i18n(mapValues(messages, (data) => getInner(data)?.[key] ?? data?.[key]));
			});
			if (schema.list) schema.list = schema.list.map((inner, index) => {
				return inner.i18n(mapValues(messages, (data = {}) => {
					if (Array.isArray(getInner(data))) return getInner(data)[index];
					if (Array.isArray(data)) return data[index];
					return extractKeys(data);
				}));
			});
			if (schema.inner) schema.inner = schema.inner.i18n(mapValues(messages, (data) => {
				if (getInner(data)) return getInner(data);
				return extractKeys(data);
			}));
			if (schema.sKey) schema.sKey = schema.sKey.i18n(mapValues(messages, (data) => data?.$key));
			return schema;
		};
		Schema.prototype.extra = function extra(key, value) {
			const schema = Schema(this);
			schema.meta = {
				...schema.meta,
				[key]: value
			};
			return schema;
		};
		for (const key of [
			"required",
			"disabled",
			"collapse",
			"hidden",
			"loose"
		]) Object.assign(Schema.prototype, { [key](value = true) {
			const schema = Schema(this);
			schema.meta = {
				...schema.meta,
				[key]: value
			};
			return schema;
		} });
		Schema.prototype.deprecated = function deprecated() {
			const schema = Schema(this);
			schema.meta.badges ||= [];
			schema.meta.badges.push({
				text: "deprecated",
				type: "danger"
			});
			return schema;
		};
		Schema.prototype.experimental = function experimental() {
			const schema = Schema(this);
			schema.meta.badges ||= [];
			schema.meta.badges.push({
				text: "experimental",
				type: "warning"
			});
			return schema;
		};
		Schema.prototype.pattern = function pattern(regexp) {
			const schema = Schema(this);
			const pattern = pick(regexp, ["source", "flags"]);
			schema.meta = {
				...schema.meta,
				pattern
			};
			return schema;
		};
		Schema.prototype.simplify = function simplify(value) {
			if (deepEqual(value, this.meta.default, this.type === "dict")) return null;
			if (isNullable(value)) return value;
			if (this.type === "object" || this.type === "dict") {
				const result = {};
				for (const key in value) {
					const item = (this.type === "object" ? this.dict[key] : this.inner)?.simplify(value[key]);
					if (this.type === "dict" || !isNullable(item)) result[key] = item;
				}
				if (deepEqual(result, this.meta.default, this.type === "dict")) return null;
				return result;
			} else if (this.type === "array" || this.type === "tuple") {
				const result = [];
				value.forEach((value, index) => {
					const schema = this.type === "array" ? this.inner : this.list[index];
					const item = schema ? schema.simplify(value) : value;
					result.push(item);
				});
				return result;
			} else if (this.type === "intersect") {
				const result = {};
				for (const item of this.list) Object.assign(result, item.simplify(value));
				return result;
			} else if (this.type === "union") for (const schema of this.list) try {
				Schema.resolve(value, schema, {});
				return schema.simplify(value);
			} catch {}
			return value;
		};
		Schema.prototype.toString = function toString(inline) {
			return formatters[this.type]?.(this, inline) ?? `Schema<${this.type}>`;
		};
		Schema.prototype.role = function role(role, extra) {
			const schema = Schema(this);
			schema.meta = {
				...schema.meta,
				role,
				extra
			};
			return schema;
		};
		for (const key of [
			"default",
			"link",
			"comment",
			"description",
			"max",
			"min",
			"step"
		]) Object.assign(Schema.prototype, { [key](value) {
			const schema = Schema(this);
			schema.meta = {
				...schema.meta,
				[key]: value
			};
			return schema;
		} });
		const resolvers = {};
		Schema.extend = function extend(type, resolve) {
			resolvers[type] = resolve;
		};
		Schema.resolve = function resolve(data, schema, options = {}, strict = false) {
			if (!schema) return [data];
			if (options.ignore?.(data, schema)) return [data];
			if (isNullable(data) && schema.type !== "lazy") {
				if (schema.meta.required) throw new ValidationError(`missing required value`, options);
				let current = schema;
				let fallback = schema.meta.default;
				while (current?.type === "intersect" && isNullable(fallback)) {
					current = current.list[0];
					fallback = current?.meta.default;
				}
				if (isNullable(fallback)) return [data];
				data = clone(fallback);
			}
			const callback = resolvers[schema.type];
			if (!callback) throw new ValidationError(`unsupported type "${schema.type}"`, options);
			try {
				return callback(data, schema, options, strict);
			} catch (error) {
				if (!schema.meta.loose) throw error;
				return [schema.meta.default];
			}
		};
		Schema.from = function from(source) {
			if (isNullable(source)) return Schema.any();
			else if ([
				"string",
				"number",
				"boolean"
			].includes(typeof source)) return Schema.const(source).required();
			else if (source[kSchema]) return source;
			else if (typeof source === "function") switch (source) {
				case String: return Schema.string().required();
				case Number: return Schema.number().required();
				case Boolean: return Schema.boolean().required();
				case Function: return Schema.function().required();
				default: return Schema.is(source).required();
			}
			else throw new TypeError(`cannot infer schema from ${source}`);
		};
		Schema.lazy = function lazy(builder) {
			const toJSON = () => {
				if (!schema.inner[kSchema]) {
					schema.inner = schema.builder();
					schema.inner.meta = {
						...schema.meta,
						...schema.inner.meta
					};
				}
				return schema.inner.toJSON();
			};
			const schema = new Schema({
				type: "lazy",
				builder,
				inner: { toJSON }
			});
			return schema;
		};
		Schema.natural = function natural() {
			return Schema.number().step(1).min(0);
		};
		Schema.percent = function percent() {
			return Schema.number().step(.01).min(0).max(1).role("slider");
		};
		Schema.date = function date() {
			return Schema.union([Schema.is(Date), Schema.transform(Schema.string().role("datetime"), (value, options) => {
				const date = new Date(value);
				if (isNaN(+date)) throw new ValidationError(`invalid date "${value}"`, options);
				return date;
			}, true)]);
		};
		Schema.regExp = function regExp(flag = "") {
			return Schema.union([Schema.is(RegExp), Schema.transform(Schema.string().role("regexp", { flag }), (value, options) => {
				try {
					return new RegExp(value, flag);
				} catch (e) {
					throw new ValidationError(e.message, options);
				}
			}, true)]);
		};
		Schema.arrayBuffer = function arrayBuffer(encoding) {
			return Schema.union([
				Schema.is(ArrayBuffer),
				Schema.is(SharedArrayBuffer),
				Schema.transform(Schema.any(), (value, options) => {
					if (Binary.isSource(value)) return Binary.fromSource(value);
					throw new ValidationError(`expected ArrayBufferSource but got ${value}`, options);
				}, true),
				...encoding ? [Schema.transform(Schema.string(), (value, options) => {
					try {
						return encoding === "base64" ? Binary.fromBase64(value) : Binary.fromHex(value);
					} catch (e) {
						throw new ValidationError(e.message, options);
					}
				}, true)] : []
			]);
		};
		Schema.extend("lazy", (data, schema, options, strict) => {
			if (!schema.inner[kSchema]) {
				schema.inner = schema.builder();
				schema.inner.meta = {
					...schema.meta,
					...schema.inner.meta
				};
			}
			return Schema.resolve(data, schema.inner, options, strict);
		});
		Schema.extend("any", (data) => {
			return [data];
		});
		Schema.extend("never", (data, _, options) => {
			throw new ValidationError(`expected nullable but got ${data}`, options);
		});
		Schema.extend("const", (data, { value }, options) => {
			if (deepEqual(data, value)) return [value];
			throw new ValidationError(`expected ${value} but got ${data}`, options);
		});
		function checkWithinRange(data, meta, description, options, skipMin = false) {
			const { max = Infinity, min = -Infinity } = meta;
			if (data > max) throw new ValidationError(`expected ${description} <= ${max} but got ${data}`, options);
			if (data < min && !skipMin) throw new ValidationError(`expected ${description} >= ${min} but got ${data}`, options);
		}
		Schema.extend("string", (data, { meta }, options) => {
			if (typeof data !== "string") throw new ValidationError(`expected string but got ${data}`, options);
			if (meta.pattern) {
				const regexp = new RegExp(meta.pattern.source, meta.pattern.flags);
				if (!regexp.test(data)) throw new ValidationError(`expect string to match regexp ${regexp}`, options);
			}
			checkWithinRange(data.length, meta, "string length", options);
			return [data];
		});
		function decimalShift(data, digits) {
			const str = data.toString();
			if (str.includes("e")) return data * Math.pow(10, digits);
			const index = str.indexOf(".");
			if (index === -1) return data * Math.pow(10, digits);
			const frac = str.slice(index + 1);
			const integer = str.slice(0, index);
			if (frac.length <= digits) return +(integer + frac.padEnd(digits, "0"));
			return +(integer + frac.slice(0, digits) + "." + frac.slice(digits));
		}
		function isMultipleOf(data, min, step) {
			step = Math.abs(step);
			if (!/^\d+\.\d+$/.test(step.toString())) return (data - min) % step === 0;
			const index = step.toString().indexOf(".");
			const digits = step.toString().slice(index + 1).length;
			return Math.abs(decimalShift(data, digits) - decimalShift(min, digits)) % decimalShift(step, digits) === 0;
		}
		Schema.extend("number", (data, { meta }, options) => {
			if (typeof data !== "number") throw new ValidationError(`expected number but got ${data}`, options);
			checkWithinRange(data, meta, "number", options);
			const { step } = meta;
			if (step && !isMultipleOf(data, meta.min ?? 0, step)) throw new ValidationError(`expected number multiple of ${step} but got ${data}`, options);
			return [data];
		});
		Schema.extend("boolean", (data, _, options) => {
			if (typeof data === "boolean") return [data];
			throw new ValidationError(`expected boolean but got ${data}`, options);
		});
		Schema.extend("bitset", (data, { bits, meta }, options) => {
			let value = 0, keys = [];
			if (typeof data === "number") {
				value = data;
				for (const key in bits) if (data & bits[key]) keys.push(key);
			} else if (Array.isArray(data)) {
				keys = data;
				for (const key of keys) {
					if (typeof key !== "string") throw new ValidationError(`expected string but got ${key}`, options);
					if (key in bits) value |= bits[key];
				}
			} else throw new ValidationError(`expected number or array but got ${data}`, options);
			if (value === meta.default) return [value];
			return [value, keys];
		});
		Schema.extend("function", (data, _, options) => {
			if (typeof data === "function") return [data];
			throw new ValidationError(`expected function but got ${data}`, options);
		});
		Schema.extend("is", (data, { constructor }, options) => {
			if (typeof constructor === "function") {
				if (data instanceof constructor) return [data];
				throw new ValidationError(`expected ${constructor.name} but got ${data}`, options);
			} else {
				if (isNullable(data)) throw new ValidationError(`expected ${constructor} but got ${data}`, options);
				let prototype = Object.getPrototypeOf(data);
				while (prototype) {
					if (prototype.constructor?.name === constructor) return [data];
					prototype = Object.getPrototypeOf(prototype);
				}
				throw new ValidationError(`expected ${constructor} but got ${data}`, options);
			}
		});
		function property(data, key, schema, options) {
			try {
				const [value, adapted] = Schema.resolve(data[key], schema, {
					...options,
					path: [...options.path || [], key]
				});
				if (adapted !== void 0) data[key] = adapted;
				return value;
			} catch (e) {
				if (!options?.autofix) throw e;
				delete data[key];
				return schema.meta.default;
			}
		}
		Schema.extend("array", (data, { inner, meta }, options) => {
			if (!Array.isArray(data)) throw new ValidationError(`expected array but got ${data}`, options);
			checkWithinRange(data.length, meta, "array length", options, !isNullable(inner.meta.default));
			return [data.map((_, index) => property(data, index, inner, options))];
		});
		Schema.extend("dict", (data, { inner, sKey }, options, strict) => {
			if (!isPlainObject(data)) throw new ValidationError(`expected object but got ${data}`, options);
			const result = {};
			for (const key in data) {
				let rKey;
				try {
					rKey = Schema.resolve(key, sKey, options)[0];
				} catch (error) {
					if (strict) continue;
					throw error;
				}
				result[rKey] = property(data, key, inner, options);
				data[rKey] = data[key];
				if (key !== rKey) delete data[key];
			}
			return [result];
		});
		Schema.extend("tuple", (data, { list }, options, strict) => {
			if (!Array.isArray(data)) throw new ValidationError(`expected array but got ${data}`, options);
			const result = list.map((inner, index) => property(data, index, inner, options));
			if (strict) return [result];
			result.push(...data.slice(list.length));
			return [result];
		});
		function merge(result, data) {
			for (const key in data) {
				if (key in result) continue;
				result[key] = data[key];
			}
		}
		Schema.extend("object", (data, { dict }, options, strict) => {
			if (!isPlainObject(data)) throw new ValidationError(`expected object but got ${data}`, options);
			const result = {};
			for (const key in dict) {
				const value = property(data, key, dict[key], options);
				if (!isNullable(value) || key in data) result[key] = value;
			}
			if (!strict) merge(result, data);
			return [result];
		});
		Schema.extend("union", (data, { list, toString }, options, strict) => {
			const messages = [];
			for (const inner of list) try {
				return Schema.resolve(data, inner, options, strict);
			} catch (error) {
				messages.push(error);
			}
			throw new ValidationError(`expected ${toString()} but got ${JSON.stringify(data)}`, options);
		});
		Schema.extend("intersect", (data, { list, toString }, options, strict) => {
			if (!list.length) return [data];
			let result;
			for (const inner of list) {
				const value = Schema.resolve(data, inner, options, true)[0];
				if (isNullable(value)) continue;
				if (isNullable(result)) result = value;
				else if (typeof result !== typeof value) throw new ValidationError(`expected ${toString()} but got ${JSON.stringify(data)}`, options);
				else if (typeof value === "object") merge(result ??= {}, value);
				else if (result !== value) throw new ValidationError(`expected ${toString()} but got ${JSON.stringify(data)}`, options);
			}
			if (!strict && isPlainObject(data)) merge(result, data);
			return [result];
		});
		Schema.extend("transform", (data, { inner, callback, preserve }, options) => {
			const [result, adapted = data] = Schema.resolve(data, inner, options, true);
			if (preserve) return [callback(result)];
			else return [callback(result), callback(adapted)];
		});
		const formatters = {};
		function defineMethod(name, keys, format) {
			formatters[name] = format;
			Object.assign(Schema, { [name](...args) {
				const schema = new Schema({ type: name });
				keys.forEach((key, index) => {
					switch (key) {
						case "sKey":
							schema.sKey = args[index] ?? Schema.string();
							break;
						case "inner":
							schema.inner = Schema.from(args[index]);
							break;
						case "list":
							schema.list = args[index].map(Schema.from);
							break;
						case "dict":
							schema.dict = mapValues(args[index], Schema.from);
							break;
						case "bits":
							schema.bits = {};
							for (const key in args[index]) {
								if (typeof args[index][key] !== "number") continue;
								schema.bits[key] = args[index][key];
							}
							break;
						case "callback": {
							const callback = schema.callback = args[index];
							callback["toJSON"] ||= () => callback.toString();
							break;
						}
						case "constructor": {
							const constructor = schema.constructor = args[index];
							if (typeof constructor === "function") constructor["toJSON"] ||= () => constructor["name"];
							break;
						}
						default: schema[key] = args[index];
					}
				});
				if (name === "object" || name === "dict") schema.meta.default = {};
				else if (name === "array" || name === "tuple") schema.meta.default = [];
				else if (name === "bitset") schema.meta.default = 0;
				return schema;
			} });
		}
		defineMethod("is", ["constructor"], ({ constructor }) => {
			if (typeof constructor === "function") return constructor.name;
			else return constructor;
		});
		defineMethod("any", [], () => "any");
		defineMethod("never", [], () => "never");
		defineMethod("const", ["value"], ({ value }) => typeof value === "string" ? JSON.stringify(value) : value);
		defineMethod("string", [], () => "string");
		defineMethod("number", [], () => "number");
		defineMethod("boolean", [], () => "boolean");
		defineMethod("bitset", ["bits"], () => "bitset");
		defineMethod("function", [], () => "function");
		defineMethod("array", ["inner"], ({ inner }) => `${inner.toString(true)}[]`);
		defineMethod("dict", ["inner", "sKey"], ({ inner, sKey }) => `{ [key: ${sKey.toString()}]: ${inner.toString()} }`);
		defineMethod("tuple", ["list"], ({ list }) => `[${list.map((inner) => inner.toString()).join(", ")}]`);
		defineMethod("object", ["dict"], ({ dict }) => {
			if (Object.keys(dict).length === 0) return "{}";
			return `{ ${Object.entries(dict).map(([key, inner]) => {
				return `${key}${inner.meta.required ? "" : "?"}: ${inner.toString()}`;
			}).join(", ")} }`;
		});
		defineMethod("union", ["list"], ({ list }, inline) => {
			const result = list.map(({ toString: format }) => format()).join(" | ");
			return inline ? `(${result})` : result;
		});
		defineMethod("intersect", ["list"], ({ list }) => {
			return `${list.map((inner) => inner.toString(true)).join(" & ")}`;
		});
		defineMethod("transform", [
			"inner",
			"callback",
			"preserve"
		], ({ inner }, isInner) => inner.toString(isInner));
		//#endregion
		//#region src/config.ts
		/** Validated defaults for the Firefly assistant. */
		const Config = Schema.object({
			enabled: Schema.boolean().default(true),
			defaultRight: Schema.number().min(8).default(24),
			defaultBottom: Schema.number().min(8).default(80),
			historyRefreshMs: Schema.number().min(500).max(6e4).default(1200),
			publicationTimeoutMs: Schema.number().min(1e3).max(6e4).default(1e4)
		});
		//#endregion
		//#region src/client/position.ts
		/**
		* Keep the entire dock visible, including after a smaller viewport restores saved offsets.
		* @param position - Desired viewport offsets.
		* @param viewport - Current viewport dimensions.
		* @param dock - Measured dock dimensions, including an expanded panel.
		* @returns Offsets with an 8px clearance where space permits.
		*/
		function clampPosition(position, viewport, dock) {
			const clamp = (offset, available) => {
				const max = Math.max(0, available);
				const margin = Math.min(8, max / 2);
				return Math.round(Math.min(Math.max(offset, margin), Math.max(margin, max - margin)));
			};
			return {
				right: clamp(position.right, viewport.width - dock.width),
				bottom: clamp(position.bottom, viewport.height - dock.height)
			};
		}
		//#endregion
		//#region src/client/TransformDevice.tsx
		function TransformDevice({ size = 80, className }) {
			const id = (0, react.useId)();
			const silver = `${id}-silver`;
			const bevel = `${id}-bevel`;
			const gold = `${id}-gold`;
			const glass = `${id}-glass`;
			const energy = `${id}-energy`;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				width: size,
				height: size,
				viewBox: "0 0 96 96",
				fill: "none",
				className,
				"aria-hidden": "true",
				focusable: "false",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("defs", { children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("linearGradient", {
							id: silver,
							x1: "32",
							y1: "24",
							x2: "62",
							y2: "74",
							gradientUnits: "userSpaceOnUse",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", { stopColor: "#FFFFFF" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: ".28",
									stopColor: "#F0EEE1"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: ".48",
									stopColor: "#A7BBC1"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: ".57",
									stopColor: "#F7F9F2"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: "1",
									stopColor: "#687E89"
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("linearGradient", {
							id: bevel,
							x1: "30",
							y1: "40",
							x2: "65",
							y2: "56",
							gradientUnits: "userSpaceOnUse",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", { stopColor: "#536774" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: ".3",
									stopColor: "#D8E6E4"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: ".55",
									stopColor: "#FAF9EB"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: "1",
									stopColor: "#465B69"
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("linearGradient", {
							id: gold,
							x1: "36",
							y1: "12",
							x2: "58",
							y2: "64",
							gradientUnits: "userSpaceOnUse",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", { stopColor: "#FFF0B1" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: ".3",
									stopColor: "#D9B968"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: ".5",
									stopColor: "#8D6831"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: ".66",
									stopColor: "#F4D998"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: "1",
									stopColor: "#B98D47"
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("linearGradient", {
							id: glass,
							x1: "6",
							y1: "21",
							x2: "36",
							y2: "56",
							gradientUnits: "userSpaceOnUse",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									stopColor: "#E3FFF7",
									stopOpacity: ".85"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: ".42",
									stopColor: "#8CE9DD",
									stopOpacity: ".48"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: "1",
									stopColor: "#219C9B",
									stopOpacity: ".16"
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("linearGradient", {
							id: energy,
							x1: "44",
							y1: "33",
							x2: "53",
							y2: "68",
							gradientUnits: "userSpaceOnUse",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", { stopColor: "#E1FFFF" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: ".36",
									stopColor: "#88FFF1"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: ".7",
									stopColor: "#29D9D2"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: "1",
									stopColor: "#087B8B"
								})
							]
						})
					] }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("g", {
						className: "ff-device-wing",
						children: [false, true].map((mirrored) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
							transform: mirrored ? "translate(96 0) scale(-1 1)" : void 0,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M4 18 20 25 37 40 36 56 22 43Z",
									fill: `url(#${glass})`,
									stroke: "#B9EFE7",
									strokeOpacity: ".7",
									strokeWidth: ".8"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M4 18 27 35 36 50 22 40Z",
									fill: "#E2FFF7",
									fillOpacity: ".18"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M8 23 26 37 34 51",
									stroke: "#E0FFF8",
									strokeOpacity: ".8",
									strokeWidth: ".8"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M10 39 24 45 36 57 38 66 24 56Z",
									fill: `url(#${glass})`,
									stroke: "#95DCD5",
									strokeOpacity: ".55",
									strokeWidth: ".7"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M13 42 27 51 36 62",
									stroke: "#D2FFF1",
									strokeOpacity: ".55",
									strokeWidth: ".7"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M25 32 37 38 38 48 32 44Z",
									fill: `url(#${gold})`
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M26 33 35 39 35 43",
									stroke: "#FFF0C0",
									strokeWidth: ".8"
								})
							]
						}, String(mirrored)))
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M48 15 64 26 67 40 61 66 48 88 35 66 29 40 32 26Z",
						fill: "#101F28",
						stroke: "#52636A",
						strokeWidth: "1"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M33 27 43 23 39 39 40 59 48 80 36 65 30 40Z",
						fill: `url(#${silver})`
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M63 27 53 23 57 39 56 59 48 80 60 65 66 40Z",
						fill: `url(#${silver})`
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M33 28 38 31 34 42 38 62 46 77 35 64 30 40Z",
						fill: `url(#${bevel})`
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M63 28 58 31 62 42 58 62 50 77 61 64 66 40Z",
						fill: `url(#${bevel})`
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M34 28 40 26 36 40 40 60M62 28 56 26 60 40 56 60",
						stroke: "#FFFFF0",
						strokeOpacity: ".85",
						strokeWidth: ".9"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M31 14 44 21 48 10 52 21 65 14 61 29 54 34 48 26 42 34 35 29Z",
						fill: `url(#${gold})`,
						stroke: "#96773D",
						strokeWidth: ".7"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M31 14 38 23 44 25 48 10 44 21Z M65 14 58 23 52 25 48 10 52 21Z",
						fill: "#FFF0B9",
						fillOpacity: ".7"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M38 27 44 29 48 23 52 29 58 27 53 36 48 31 43 36Z",
						fill: "#101B23"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M48 19 52 27 48 31 44 27Z",
						fill: `url(#${silver})`
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M48 30 56 45 53 62 48 73 43 62 40 45Z",
						fill: "#030F17",
						stroke: "#748C8D",
						strokeWidth: ".8"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
						className: "ff-device-core",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
								d: "M48 33 53 46 51 60 48 69 45 60 43 46Z",
								fill: `url(#${energy})`
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
								d: "M48 33 48 66 45 57 43 46Z",
								fill: "#BBFFF5",
								fillOpacity: ".65"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
								d: "M48 33 53 46 48 51Z",
								fill: "#F0FFFC",
								fillOpacity: ".8"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
								d: "M48 37 48 62",
								stroke: "#E6FFFC",
								strokeWidth: ".8",
								strokeOpacity: ".9"
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M36 47 40 51 43 65 40 62Z M60 47 56 51 53 65 56 62Z",
						fill: `url(#${gold})`
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M39 66 48 76 57 66 48 87Z",
						fill: `url(#${silver})`
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M48 76 48 87 57 66Z",
						fill: "#526A75",
						fillOpacity: ".6"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M42 71 48 77 54 71",
						stroke: "#FFF0C0",
						strokeWidth: "1"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M48 78 48 84",
						stroke: "#EDF8EE",
						strokeWidth: ".8"
					})
				]
			});
		}
		//#endregion
		//#region src/client/StudioScene.tsx
		function Plant({ x, y, small = false }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
				transform: `translate(${x} ${y}) scale(${small ? .6 : 1})`,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M-2 0V-20h4V0M-2-12h-9v-6h-5v-7h9v7h5M2-18h9v-6h6v-7H8v7H2",
						fill: "#688e76"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M-2-24v-12h6v12M-8-19h-6v-4h6M10-24v-5h5v5",
						fill: "#98bfa0"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M-11 0h22v6H8v12H-8V6h-3",
						fill: "#c99e83"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M-7 3H7v12H-7",
						fill: "#e3b89a"
					})
				]
			});
		}
		function Desk({ x, y, hair, shirt, index }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
				transform: `translate(${x} ${y})`,
				"data-worker": index,
				style: { "--ff-worker-delay": index * .26 + "s" },
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ellipse", {
						cx: "44",
						cy: "90",
						rx: "43",
						ry: "7",
						fill: "#8ca59a",
						opacity: ".16"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M16 47h14v39H16M79 47h7v39h-7",
						fill: "#a18068"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M9 41h87v10H9z",
						fill: "#c09e7d"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M9 41h87v4H9z",
						fill: "#e1c5a1"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M58 14h29v23H58z",
						fill: "#566c66"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M61 17h23v16H61z",
						fill: "#aad4c4"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M69 37h6v5h-6M66 41h12v2H66",
						fill: "#647d73"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("g", {
						className: "ff-screen-lines",
						fill: "#f0fff5",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M64 21h12v2H64M64 25h17v2H64M64 29h8v2H64" })
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M57 44h21v3H57",
						fill: "#f0e9d9"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M88 34h6v7h-6M94 35h3v4h-3",
						fill: "#f7ead3"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M88 34h6v2h-6",
						fill: "#a9896e"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M13 35h15v3H13",
						fill: "#aeabc6"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M15 32h15v3H15",
						fill: "#ede2c5"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M23 67h27v12H23M33 79h6v8h-6M24 87h25v3H24",
						fill: "#718a81"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M26 76h7v12h-7M43 76h7v12h-7",
						fill: "#586b68"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M23 86h12v5H23M43 86h11v5H43",
						fill: "#3d5351"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
						className: "ff-worker-body",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
								d: "M24 42h23v5h5v22H20V49h4",
								fill: shirt
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
								d: "M25 45h6v21h-6",
								fill: "#fff",
								opacity: ".2"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
								className: "ff-worker-arms",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M45 49h8v5h10v5H49v-4h-4",
										fill: shirt
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M59 51h7v6h-7",
										fill: "#eac7ad"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M24 51h-6v9h6v-4h7v-5",
										fill: shirt
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M28 50h6v6h-6",
										fill: "#efcfb5"
									})
								]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
								className: "ff-worker-head",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M23 15h21v4h5v20h-5v7H25v-4h-7V22h5",
										fill: hair
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M30 25h17v13h-4v5H30z",
										fill: "#efcdb2"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M43 27h3v4h-3M43 35h4v2h-4",
										fill: "#4c554d"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M23 16h20v8H31v5h-8v10h-5V22h5",
										fill: hair
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M24 16h16v3H24M21 22h3v11h-3",
										fill: "#fff",
										opacity: ".24"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
										x: "30",
										y: "39",
										width: "7",
										height: "6",
										fill: "#e2b99b"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M18 60h21v15H18z",
						fill: "#88a498"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M21 59h15v3H21z",
						fill: "#a2b9ac"
					})
				]
			});
		}
		/** Decorative coworkers visualize a single assistant; no simulated task counts or agent identities. */
		function StudioScene({ mode, label }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				"data-firefly-studio": true,
				"data-mode": mode,
				role: "img",
				"aria-label": label,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 440 204",
					fill: "none",
					"aria-hidden": "true",
					shapeRendering: "crispEdges",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M0 0h440v204H0z",
							fill: "#e8ede1"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M0 0h440v97H0z",
							fill: "#e4eadb"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M0 97h440v107H0z",
							fill: "#d9dfd0"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M0 97h440v5H0",
							fill: "#bccabc"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M0 137h440M0 173h440M75 102v35M231 102v35M380 102v35M8 137v36M157 137v36M312 137v36M80 173v31M231 173v31M383 173v31",
							stroke: "#c4cfc0",
							strokeWidth: "1"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M38 13h113v65H38z",
							fill: "#a4bcb0"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M42 17h105v57H42z",
							fill: "#c5ded2"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M48 67V49h15V34h14v33M116 67V40h17v27",
							fill: "#a3c5b5"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M76 67V42h23v25M99 67V55h14v12",
							fill: "#b2d0bd"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M94 17v57M42 44h105",
							stroke: "#eef3e7",
							strokeWidth: "4"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M33 77h123v6H33z",
							fill: "#abbcaf"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M185 27h46v33h-46z",
							fill: "#b6a68f"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M189 31h38v25h-38z",
							fill: "#f2edde"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M199 49v-7h6v7h5V37h6v12h5v3h-26v-3",
							fill: "#a3b99c"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M288 36h97v5h-97zM299 57h74v5h-74z",
							fill: "#b7a183"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M298 20h6v16h-6M306 18h7v18h-7M315 23h5v13h-5",
							fill: "#87a896"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M322 18h7v18h-7M331 21h6v15h-6",
							fill: "#c8a391"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M315 49h24v8h-24z",
							fill: "#b6acc4"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M317 46h20v3h-20",
							fill: "#e3d6bb"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Plant, {
							x: 365,
							y: 28,
							small: true
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M248 8h22v22h-22z",
							fill: "#f4f0df"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M250 10h18v18h-18z",
							fill: "#d4ddc9"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M259 13v7h5",
							stroke: "#6e8273",
							strokeWidth: "2"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Desk, {
							x: 30,
							y: 86,
							hair: "#d3ded6",
							shirt: "#80b6a1",
							index: 1
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Desk, {
							x: 164,
							y: 62,
							hair: "#826651",
							shirt: "#d0b98d",
							index: 2
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Desk, {
							x: 289,
							y: 89,
							hair: "#51596a",
							shirt: "#afa4ca",
							index: 3
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Plant, {
							x: 17,
							y: 108
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Plant, {
							x: 416,
							y: 133
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M159 171h11v17h-11zM156 169h17v4h-17z",
							fill: "#ae9478"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M157 161h7v8h-7M161 154h7v10h-7M168 160h6v9h-6",
							fill: "#739f7e"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M414 55v41h-3V55M402 55h23l-5-14h-13z",
							fill: "#c7ad7e"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							className: "ff-office-lamp",
							d: "M405 56h16l14 39h-44z",
							fill: "#f9eabe",
							opacity: ".18"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M247 179h38v11h-38z",
							fill: "#c2cab8"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M250 181h32v2h-32",
							fill: "#e4e5d4"
						})
					]
				})
			});
		}
		//#endregion
		//#region src/client/FireflyDock.tsx
		function Icon({ name }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				width: "15",
				height: "15",
				viewBox: "0 0 16 16",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: name === "grip" ? 2 : 1.4,
				strokeLinecap: "round",
				strokeLinejoin: "round",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: {
					close: "m4 4 8 8M12 4l-8 8",
					arrow: "M8 13V3m-4 4 4-4 4 4",
					new: "M8 3v10M3 8h10",
					refresh: "M13 7a5 5 0 1 0-1 4M13 2v5H8",
					grip: "M5 4h.01M11 4h.01M5 8h.01M11 8h.01M5 12h.01M11 12h.01"
				}[name] })
			});
		}
		/** Independent conversation and device launcher; all session facts are passed as props. */
		function FireflyDock(props) {
			const { t, preferences, assistant, expanded, setExpanded, draft, editDraft, setPosition, startChat, sendMessage, reveal, refresh, loadOlder, resetChat, selectWorkspace } = props;
			const [dragPosition, setDragPosition] = (0, react.useState)(null);
			const [confirmNew, setConfirmNew] = (0, react.useState)(false);
			const [atBottom, setAtBottom] = (0, react.useState)(true);
			const dock = (0, react.useRef)(null);
			const launcher = (0, react.useRef)(null);
			const input = (0, react.useRef)(null);
			const scroll = (0, react.useRef)(null);
			const follow = (0, react.useRef)(true);
			const olderAnchor = (0, react.useRef)(null);
			const drag = (0, react.useRef)(null);
			const suppressClick = (0, react.useRef)(false);
			const panelId = (0, react.useId)();
			const titleId = (0, react.useId)();
			const workspaceSelectId = (0, react.useId)();
			const position = dragPosition ?? preferences.values;
			const ready = assistant.phase === "ready";
			const choosing = assistant.phase === "empty";
			const busy = assistant.phase === "creating" || assistant.phase === "restoring";
			const status = assistant.status;
			const studioMode = assistant.pendingCount > 0 ? "waiting" : ["failed", "unavailable"].includes(status) ? "error" : assistant.running || assistant.sending || busy ? "working" : "idle";
			const workspaceId = assistant.workspaceId ?? assistant.workspaces[0]?.workspaceId;
			const canSubmit = !assistant.sending && !busy && draft.text.trim() !== "" && (choosing && workspaceId !== void 0 || ready && assistant.canSend);
			function send() {
				if (!canSubmit) return;
				follow.current = true;
				if (choosing && workspaceId !== void 0) startChat(workspaceId, draft);
				else sendMessage(draft);
			}
			(0, react.useLayoutEffect)(() => {
				const el = scroll.current;
				if (!el) return;
				if (assistant.messages.length === 0) {
					el.scrollTop = 0;
					return;
				}
				if (olderAnchor.current && !assistant.loadingOlder) {
					el.scrollTop = olderAnchor.current.top + Math.max(0, el.scrollHeight - olderAnchor.current.height);
					olderAnchor.current = null;
				} else if (follow.current) el.scrollTop = el.scrollHeight;
			}, [
				assistant.messages,
				assistant.loadingOlder,
				expanded
			]);
			(0, react.useEffect)(() => {
				follow.current = true;
				setAtBottom(true);
			}, [assistant.sessionId]);
			const constrain = (candidate) => {
				const rect = dock.current?.getBoundingClientRect();
				return clampPosition(candidate, {
					width: window.innerWidth,
					height: window.innerHeight
				}, {
					width: rect?.width ?? 84,
					height: rect?.height ?? 84
				});
			};
			(0, react.useLayoutEffect)(() => {
				const fit = () => {
					const rect = dock.current?.getBoundingClientRect();
					if (!rect) return;
					const fitted = clampPosition(preferences.values, {
						width: window.innerWidth,
						height: window.innerHeight
					}, rect);
					if (fitted.right !== preferences.values.right || fitted.bottom !== preferences.values.bottom) setPosition(fitted);
				};
				fit();
				window.addEventListener("resize", fit);
				const observer = new ResizeObserver(fit);
				if (dock.current) observer.observe(dock.current);
				return () => {
					window.removeEventListener("resize", fit);
					observer.disconnect();
				};
			}, [
				expanded,
				preferences.values.right,
				preferences.values.bottom,
				setPosition
			]);
			const wasExpanded = (0, react.useRef)(expanded);
			(0, react.useEffect)(() => {
				if (expanded && !wasExpanded.current) input.current?.focus({ preventScroll: true });
				wasExpanded.current = expanded;
			}, [expanded]);
			function close() {
				setExpanded(false);
				launcher.current?.focus({ preventScroll: true });
			}
			function startDrag(event) {
				if (!event.isPrimary || event.button !== 0) return;
				event.currentTarget.focus({ preventScroll: true });
				event.currentTarget.setPointerCapture(event.pointerId);
				suppressClick.current = false;
				drag.current = {
					pointerId: event.pointerId,
					x: event.clientX,
					y: event.clientY,
					start: preferences.values,
					latest: preferences.values,
					moved: false
				};
			}
			function moveDrag(event) {
				const current = drag.current;
				if (current === null || current.pointerId !== event.pointerId) return;
				const dx = event.clientX - current.x;
				const dy = event.clientY - current.y;
				if (!current.moved && Math.hypot(dx, dy) < 5) return;
				current.moved = true;
				suppressClick.current = true;
				current.latest = constrain({
					right: current.start.right - dx,
					bottom: current.start.bottom - dy
				});
				setDragPosition(current.latest);
			}
			function endDrag(event, cancelled = false) {
				const current = drag.current;
				if (current === null || current.pointerId !== event.pointerId) return;
				drag.current = null;
				if (current.moved && !cancelled) setPosition(current.latest);
				setDragPosition(null);
				if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
			}
			function moveWithKeyboard(event) {
				const step = event.shiftKey ? 32 : 12;
				const offset = {
					ArrowLeft: {
						right: step,
						bottom: 0
					},
					ArrowRight: {
						right: -step,
						bottom: 0
					},
					ArrowUp: {
						right: 0,
						bottom: step
					},
					ArrowDown: {
						right: 0,
						bottom: -step
					}
				}[event.key];
				if (!offset) return;
				event.preventDefault();
				setPosition(constrain({
					right: preferences.values.right + offset.right,
					bottom: preferences.values.bottom + offset.bottom
				}));
			}
			const dragHandlers = {
				onPointerDown: startDrag,
				onPointerMove: moveDrag,
				onPointerUp: (event) => {
					endDrag(event);
				},
				onPointerCancel: (event) => {
					endDrag(event, true);
				},
				onLostPointerCapture: (event) => {
					endDrag(event, true);
				},
				onKeyDown: moveWithKeyboard
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				ref: dock,
				"data-firefly-root": true,
				"data-state": status,
				"data-expanded": expanded || void 0,
				className: "dsh-firefly-assistant-dock",
				style: {
					right: position.right,
					bottom: position.bottom
				},
				onPointerDown: (event) => {
					event.stopPropagation();
				},
				onPointerMove: (event) => {
					event.stopPropagation();
				},
				onKeyDown: (event) => {
					if (event.key === "Escape" && expanded) {
						event.preventDefault();
						event.stopPropagation();
						setConfirmNew(false);
						close();
					}
				},
				children: [expanded && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
					id: panelId,
					className: "ff-panel",
					role: "dialog",
					"aria-modal": "false",
					"aria-labelledby": titleId,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
							className: "ff-header",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "ff-wordmark",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "ff-header-device",
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TransformDevice, { size: 40 })
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("h2", {
									id: titleId,
									children: ["FIREFLY ", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										lang: "zh",
										children: "流萤"
									})]
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									className: "ff-subtitle",
									children: t("studio.subtitle")
								})] })]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "ff-header-actions",
								children: [
									assistant.sessionId && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "ff-icon",
										"aria-label": t("chat.new"),
										title: t("chat.new"),
										disabled: assistant.running || assistant.sending || busy,
										onClick: () => {
											setConfirmNew((value) => !value);
										},
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { name: "new" })
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "ff-icon ff-grip",
										"aria-label": t("drag"),
										title: t("drag"),
										...dragHandlers,
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { name: "grip" })
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "ff-icon",
										"aria-label": t("close"),
										title: t("close"),
										onClick: close,
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { name: "close" })
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "ff-context",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: "ff-status",
									role: "status",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "ff-status-dot",
										"aria-hidden": "true"
									}), t("status." + status)]
								}),
								assistant.workspace && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "ff-context-divider",
									children: "/"
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "ff-context-path",
									title: assistant.workspace.path,
									children: assistant.workspace.title
								})] }),
								assistant.model && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "ff-context-divider",
									children: "/"
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "ff-context-path",
									title: assistant.model,
									children: assistant.model
								})] })
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "ff-studio-area",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(StudioScene, {
								mode: studioMode,
								label: t("studio.description")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "ff-studio-caption",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("studio." + studioMode) }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									title: t("studio.description"),
									children: t("studio.visual")
								})]
							})]
						}),
						confirmNew && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "ff-confirm",
							role: "group",
							"aria-label": t("chat.new"),
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("chat.newConfirm") }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "ff-confirm-actions",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										resetChat();
										editDraft("");
										setConfirmNew(false);
									},
									children: t("chat.confirm")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setConfirmNew(false);
									},
									children: t("chat.cancel")
								})]
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							ref: scroll,
							className: "ff-scroll",
							"data-firefly-transcript": true,
							onScroll: (event) => {
								const el = event.currentTarget;
								follow.current = el.scrollHeight - el.scrollTop - el.clientHeight < 64;
								setAtBottom(follow.current);
							},
							children: [
								assistant.hasMore && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: "ff-load-more",
									disabled: assistant.loadingOlder,
									onClick: () => {
										const el = scroll.current;
										if (el) olderAnchor.current = {
											height: el.scrollHeight,
											top: el.scrollTop
										};
										follow.current = false;
										loadOlder();
									},
									children: t("chat.older")
								}),
								assistant.messages.length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "ff-welcome",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: t("studio.welcome") }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("studio.intro") }),
										choosing && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "ff-setup",
											children: [
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
													htmlFor: workspaceSelectId,
													children: t("chat.workspace")
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
													id: workspaceSelectId,
													value: workspaceId ?? "",
													disabled: assistant.workspaces.length === 0,
													onChange: (event) => {
														const workspace = assistant.workspaces.find((w) => w.workspaceId === event.currentTarget.value);
														if (workspace) selectWorkspace(workspace.workspaceId);
													},
													children: [assistant.workspaces.length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
														value: "",
														children: t("chat.emptyWorkspace")
													}), assistant.workspaces.map((workspace) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("option", {
														value: workspace.workspaceId,
														children: [
															workspace.title,
															" · ",
															workspace.path
														]
													}, workspace.workspaceId))]
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
													className: "ff-setup-note",
													children: t("chat.setupNote")
												})
											]
										}),
										ready && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
											className: "ff-suggestions",
											children: [
												"analyze",
												"test",
												"summary"
											].map((key) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => {
													editDraft(t("prompt." + key));
													input.current?.focus();
												},
												children: t("suggest." + key)
											}, key))
										}),
										busy && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "ff-activity",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { "data-spinner": true }), t(assistant.phase === "creating" ? "chat.starting" : "chat.restoring")]
										})
									]
								}),
								assistant.messages.map((message) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("article", {
									className: message.role === "user" ? "ff-message ff-user" : "ff-message ff-assistant",
									"data-firefly-message": message.role,
									children: message.role === "user" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: "ff-user-text",
										children: message.text
									}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "ff-message-author",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(TransformDevice, { size: 20 }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("chat.assistant") })]
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: "ff-message-body",
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.MarkdownText, {
											text: message.text,
											streaming: message.streaming
										})
									})] })
								}, message.id)),
								assistant.running && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "ff-activity",
									role: "status",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { "data-spinner": true }), assistant.messages.at(-1)?.streaming ? t("chat.thinking") : t("chat.toolRunning")]
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "ff-compose-area",
							children: [
								!atBottom && assistant.messages.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: "ff-load-more",
									onClick: () => {
										follow.current = true;
										if (scroll.current) scroll.current.scrollTop = scroll.current.scrollHeight;
										setAtBottom(true);
									},
									children: t("chat.latest")
								}),
								assistant.phase === "unavailable" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "ff-notice",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { children: t(assistant.error?.code === "missing-session" ? "chat.missing" : "chat.error") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "ff-chat-link",
										disabled: assistant.sending || busy,
										onClick: () => {
											resetChat();
											editDraft("");
										},
										children: t("chat.reset")
									})]
								}),
								assistant.pendingCount > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "ff-notice",
									role: "status",
									children: [
										t("chat.pending"),
										" ",
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
											type: "button",
											className: "ff-chat-link",
											onClick: reveal,
											children: [t("reveal"), " ↗"]
										})
									]
								}),
								ready && !assistant.canSend && !assistant.sending && assistant.pendingCount === 0 && assistant.blockedReason && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "ff-notice",
									role: "status",
									children: assistant.blockedReason
								}),
								assistant.error && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "ff-notice",
									"data-error": true,
									role: "alert",
									children: [assistant.error.code === "slash" ? t("block.slash") : assistant.error.code === "empty" ? t("block.empty") : assistant.error.message, assistant.sessionId && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "ff-chat-link",
										onClick: refresh,
										title: t("chat.refresh"),
										"aria-label": t("chat.refresh"),
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { name: "refresh" })
									})]
								}),
								(preferences.storageUnavailable || assistant.storageError) && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "ff-notice",
									role: "status",
									children: t("storage")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("form", {
									className: "ff-compose",
									onSubmit: (event) => {
										event.preventDefault();
										send();
									},
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
										ref: input,
										"aria-label": t("input"),
										placeholder: t("placeholder"),
										value: draft.text,
										disabled: busy || !choosing && !ready,
										rows: 2,
										onChange: (event) => {
											editDraft(event.currentTarget.value);
										},
										onKeyDown: (event) => {
											if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing || event.keyCode === 229 || event.repeat) return;
											event.preventDefault();
											send();
										}
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "ff-compose-footer",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "ff-compose-hint",
											children: choosing ? t("chat.start") : t("shortcut")
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											type: "submit",
											className: "ff-send",
											"aria-label": t(assistant.sending ? "sending" : choosing ? "chat.start" : "send"),
											title: t(choosing ? "chat.start" : "send"),
											disabled: !canSubmit,
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { name: "arrow" })
										})]
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "ff-footer-line",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										title: t("chat.setupNote"),
										children: assistant.permissionLabel.startsWith("Host session") || !assistant.permissionLabel ? t("chat.defaultPolicy") : assistant.permissionLabel
									}), assistant.sessionId ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "ff-chat-link",
										onClick: reveal,
										children: [t("reveal"), " ↗"]
									}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("chat.isolated") })]
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					ref: launcher,
					type: "button",
					className: "ff-launcher",
					"aria-label": t(expanded ? "close" : "open"),
					title: t("status." + status),
					"aria-expanded": expanded,
					"aria-controls": expanded ? panelId : void 0,
					...dragHandlers,
					onClick: () => {
						if (suppressClick.current) {
							suppressClick.current = false;
							return;
						}
						if (expanded) close();
						else setExpanded(true);
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(TransformDevice, { size: 82 }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "ff-orb-dot",
						"aria-hidden": "true"
					})]
				})]
			});
		}
		//#endregion
		//#region src/client/FireflyOverlay.tsx
		/**
		* Read framework hook seats once and retain draft state while the active dock is hidden.
		* @param props - Root-scoped assistant, locale and preference bindings.
		* @returns The independent chat dock or no floating UI when disabled.
		*/
		function FireflyOverlay(props) {
			const preferences = props.usePreferences((snapshot) => snapshot);
			const assistant = props.useAssistant((snapshot) => snapshot);
			const view = props.useStore((snapshot) => snapshot);
			if (!preferences.values.enabled) return null;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FireflyDock, {
				t: props.t,
				preferences,
				assistant,
				expanded: view.expanded,
				draft: view.draft,
				setExpanded: props.actions.expand,
				editDraft: props.actions.editDraft,
				setPosition: props.setPosition,
				startChat: props.startChat,
				sendMessage: props.sendMessage,
				reveal: props.reveal,
				refresh: props.refresh,
				loadOlder: props.loadOlder,
				resetChat: props.resetChat,
				selectWorkspace: props.selectWorkspace
			});
		}
		//#endregion
		//#region src/client/FireflySettings.tsx
		/**
		* Browser-local visibility and off-screen recovery controls.
		* @param props - Framework locale/preference hooks and mutation callbacks.
		* @returns The General settings row.
		*/
		function FireflySettings({ t, usePreferences, setEnabled, resetPosition }) {
			const { values, storageUnavailable } = usePreferences((snapshot) => snapshot);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				"data-firefly-settings": true,
				className: "ff-settings",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "ff-settings-heading",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "ff-settings-title",
							children: t("title")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("settings.description") })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: "ff-switch",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								type: "checkbox",
								role: "switch",
								"aria-label": t("settings.enabled"),
								checked: values.enabled,
								onChange: (event) => {
									setEnabled(event.currentTarget.checked);
								}
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { "aria-hidden": "true" })]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: "ff-reset",
						onClick: resetPosition,
						children: t("settings.reset")
					}),
					storageUnavailable && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						role: "status",
						children: t("storage")
					})
				]
			});
		}
		//#endregion
		//#region src/client/assistant-history.ts
		/**
		* Project plain human/assistant text only. Replacement copies and injected context
		* are model material, not extra human messages. Chunk text is superseded by its commit.
		* @param entries - Authoritative history pages merged by event seq.
		* @returns Chat text and durable turn outcome; no model requests or optimistic messages.
		*/
		function projectAssistantHistory(entries) {
			const rows = /* @__PURE__ */ new Map();
			let status = "idle";
			let error;
			let model;
			for (const { event } of entries) switch (event.type) {
				case "user/message":
					if (event.surfaceOp === "append" && event.data.source.kind === "user") rows.set("user:" + event.data.id, {
						id: "user:" + event.data.id,
						seq: event.seq,
						role: "user",
						streaming: false,
						text: event.data.content.flatMap((block) => block.type === "text" ? [block.text] : []).join("")
					});
					break;
				case "assistant/chunk": {
					const key = "assistant:" + event.data.turn + ":" + event.data.step;
					let row = rows.get(key);
					if (!row) {
						row = {
							id: key,
							seq: event.seq,
							turn: event.data.turn,
							role: "assistant",
							text: "",
							streaming: true,
							pending: true,
							blocks: /* @__PURE__ */ new Map()
						};
						rows.set(key, row);
					}
					const chunk = event.data.chunk;
					if (chunk.type === "block-start") row.blocks?.set(chunk.index, "");
					if (chunk.type === "text-delta") row.blocks?.set(chunk.index, (row.blocks.get(chunk.index) ?? "") + chunk.text);
					if (chunk.type === "block-end") row.blocks?.set(chunk.index, chunk.block.type === "text" ? chunk.block.text : "");
					row.text = [...row.blocks ?? []].sort(([a], [b]) => a - b).map(([, text]) => text).join("");
					break;
				}
				case "assistant/message": {
					if (event.surfaceOp !== "append") break;
					model = event.data.message.source.model;
					const key = "assistant:" + event.data.turn + ":" + event.data.step;
					rows.set(key, {
						id: key,
						seq: event.seq,
						turn: event.data.turn,
						role: "assistant",
						streaming: false,
						text: event.data.message.content.flatMap((block) => block.type === "text" ? [block.text] : []).join("")
					});
					break;
				}
				case "llm/retry":
					rows.delete("assistant:" + event.data.turn + ":" + event.data.step);
					break;
				case "turn/start":
					status = "running";
					error = void 0;
					break;
				case "turn/end":
					for (const row of rows.values()) if (row.turn === event.data.turn) {
						row.streaming = false;
						row.pending = false;
					}
					status = endStatus(event.data.reason);
					if (event.data.reason.kind === "error") error = event.data.reason.error.message;
					break;
				default: break;
			}
			return {
				messages: [...rows.values()].sort((a, b) => a.seq - b.seq).filter((row) => row.text !== "").map(({ id, role, text, streaming, pending }) => ({
					id,
					role,
					text,
					streaming,
					pending
				})),
				status,
				error,
				model
			};
		}
		function endStatus(reason) {
			switch (reason.kind) {
				case "completed": return "completed";
				case "error": return "failed";
				case "aborted":
				case "interrupted": return "stopped";
				case "max-tokens": return "limited";
				case "blocked": return "blocked";
				default: return "idle";
			}
		}
		//#endregion
		//#region src/client/assistant-controller.ts
		/** Browser persistence contains addresses only; conversation content remains on the host. */
		const ASSISTANT_STORAGE_KEY = "dsh.firefly.assistant.session.v1";
		function titleFor(id) {
			return "Firefly Assistant · " + id;
		}
		function failure(error) {
			return {
				code: "internal",
				message: error instanceof Error ? error.message : String(error)
			};
		}
		/**
		* Owns an independent session address, not the main selection or composer. History
		* uses the public host history API, including while the runtime SessionFace is cold.
		* One serialized log refresh timer runs only while this assistant is running.
		*/
		var AssistantController = class {
			services;
			storage;
			listeners = /* @__PURE__ */ new Set();
			disposers = [];
			sessionDispose;
			blockDispose;
			face;
			address;
			selected;
			disposed = false;
			active = true;
			starting = false;
			sending = false;
			loadingOlder = false;
			invalid = false;
			awaitingPublication = false;
			publicationTimer;
			historyError;
			error;
			storageError = false;
			snapshot;
			entries = [];
			history = {
				messages: [],
				status: "idle"
			};
			historyReady = false;
			historyFailed = false;
			historyHasMore = false;
			historyRead;
			historyAbort;
			generation = 0;
			refreshQueued = false;
			refreshTimer;
			signature = "";
			permissionLabel;
			refreshMs;
			publicationTimeoutMs;
			/** @param services - Existing host services; no connection pump is started. @param storage - Browser address storage, or null. */
			constructor(services, storage, options = {}) {
				this.services = services;
				this.storage = storage;
				this.refreshMs = options.historyRefreshMs ?? 1200;
				this.publicationTimeoutMs = options.publicationTimeoutMs ?? 1e4;
				if (!Number.isFinite(this.publicationTimeoutMs) || this.publicationTimeoutMs <= 0) throw new Error("publicationTimeoutMs must be positive");
				if (!Number.isFinite(this.refreshMs) || this.refreshMs <= 0) throw new Error("historyRefreshMs must be positive");
				try {
					const raw = storage?.getItem(ASSISTANT_STORAGE_KEY);
					if (raw) {
						const saved = JSON.parse(raw);
						if (typeof saved === "object" && saved !== null && "sessionId" in saved && "workspaceKey" in saved && typeof saved.sessionId === "string" && saved.sessionId !== "" && typeof saved.workspaceKey === "string" && saved.workspaceKey !== "") this.address = {
							sessionId: saved.sessionId,
							workspaceKey: saved.workspaceKey
						};
						else {
							this.invalid = true;
							this.error = {
								code: "invalid-address",
								message: "Saved assistant address is invalid. Choose a workspace and explicitly start a new session."
							};
						}
					}
				} catch {
					this.storageError = true;
					this.invalid = true;
					this.error = {
						code: "storage",
						message: "Saved assistant address could not be read. Explicitly start a new session."
					};
				}
				this.snapshot = this.buildSnapshot();
				this.disposers.push(services.sessions.list.subscribe(() => this.sync()), services.workspaces.list.subscribe(() => this.sync()), services.connection.hostDescription.subscribe(() => {
					if (services.connection.hostDescription.getSnapshot() !== void 0) {
						this.historyFailed = false;
						this.error = void 0;
						this.requestRefresh();
					} else {
						this.generation++;
						this.historyAbort?.abort();
						this.historyReady = false;
						this.refreshQueued = false;
						this.scheduleRefresh();
						this.publish();
					}
				}));
				this.sync();
			}
			getSnapshot = () => this.snapshot;
			subscribe = (listener) => {
				if (this.disposed) return () => {};
				this.listeners.add(listener);
				return () => {
					this.listeners.delete(listener);
				};
			};
			/** Pause background log reads while the plugin is disabled; accepted host work is never cancelled. @param active - Whether Firefly is enabled. */
			setActive(active) {
				if (this.disposed || this.active === active) return;
				this.active = active;
				if (!active) {
					this.generation++;
					this.historyAbort?.abort();
					this.refreshQueued = false;
				} else this.requestRefresh();
				this.scheduleRefresh();
				this.publish();
			}
			/** Choose a workspace without creating a host session or changing main navigation. @param id - Explicit workspace choice. */
			selectWorkspace(id) {
				if (this.disposed || this.starting || this.sending) return;
				if (this.selected === id) return;
				this.selected = id;
				if (this.address?.workspaceKey !== this.workspace()?.path) this.address = void 0;
				this.invalid = false;
				this.error = void 0;
				this.sync();
			}
			/** Create a fresh real host session using host defaults, never a reusable blank. @param workspaceId - Explicit workspace. @returns Creation result without automatic retries. */
			async start(workspaceId, firstMessage) {
				try {
					return await this.startOperation(workspaceId, firstMessage);
				} catch (error) {
					return this.fail(failure(error));
				}
			}
			async startOperation(workspaceId, firstMessage) {
				if (firstMessage !== void 0 && !firstMessage.trim()) return this.refuse("empty", "Enter a message.");
				if (firstMessage?.trimStart().startsWith("/")) return this.refuse("slash", "Use the dedicated full conversation for slash commands.");
				if (this.disposed) return this.refuse("disposed", "Assistant is closed.");
				if (this.starting || this.sending) return this.refuse("busy", "An assistant request is already pending.");
				const workspace = this.services.workspaces.list.getSnapshot().items.find((item) => item.workspaceId === workspaceId);
				if (!workspace || !this.baselinesReady()) return this.refuse("workspace", "Wait for the host workspace list, then choose a workspace.");
				if (this.address && !this.invalid) return this.refuse("already-started", "An assistant session is already attached.");
				this.selected = workspaceId;
				this.awaitingPublication = false;
				this.address = void 0;
				this.invalid = false;
				this.starting = true;
				this.error = void 0;
				try {
					this.sync();
					const before = new Set(this.services.sessions.list.getSnapshot().ids);
					const created = (await this.services.connection.api.sessions.create({ workspaceId })).result;
					if (!created.ok) return this.fail(created.error);
					const id = created.value.sessionId;
					if (before.has(id)) return this.fail({
						code: "session-conflict",
						message: "Host did not return a new dedicated session."
					});
					if (this.disposed) return {
						ok: false,
						error: {
							code: "disposed",
							message: "Assistant closed during creation; the new host session was left untouched.",
							details: { sessionId: id }
						}
					};
					const renamed = (await this.services.connection.api.sessions.rename({
						sessionId: id,
						title: titleFor(id)
					})).result;
					if (!renamed.ok) return this.fail({
						...renamed.error,
						details: {
							cause: renamed.error.details,
							sessionId: id
						}
					});
					if (this.disposed) return {
						ok: false,
						error: {
							code: "disposed",
							message: "Assistant closed during creation.",
							details: { sessionId: id }
						}
					};
					this.error = void 0;
					this.address = {
						sessionId: id,
						workspaceKey: workspace.path
					};
					this.awaitingPublication = true;
					if (this.publicationTimer !== void 0) clearTimeout(this.publicationTimer);
					this.publicationTimer = setTimeout(() => {
						if (this.disposed || !this.awaitingPublication || this.address?.sessionId !== id) return;
						this.awaitingPublication = false;
						this.invalid = true;
						this.error = {
							code: "publication-timeout",
							message: "The new conversation did not appear in the host list. Reload history or explicitly start again; the first message will not be retried."
						};
						this.sync();
					}, this.publicationTimeoutMs);
					try {
						this.storage?.setItem(ASSISTANT_STORAGE_KEY, JSON.stringify(this.address));
					} catch {
						this.storageError = true;
					}
					if (firstMessage !== void 0) {
						if (!this.active || this.disposed) return this.refuse("disabled", "Assistant was closed before the first message was submitted.");
						const receipt = (await this.services.connection.api.sessions.prompt({
							sessionId: id,
							content: [{
								type: "text",
								text: firstMessage
							}],
							mode: "queue"
						})).result;
						if (!receipt.ok) return this.fail(receipt.error);
					}
					return {
						ok: true,
						sessionId: id
					};
				} catch (error) {
					return this.fail(failure(error));
				} finally {
					this.starting = false;
					this.sync();
					if (this.historyRead) await this.historyRead;
				}
			}
			/** Revalidate the saved identity against the current host baseline, without reconnecting or creating. @returns Address validation result. */
			/** Explicit log reload; does not create sessions or retry prompts. */
			refresh() {
				return this.retryRestore();
			}
			async retryRestore() {
				try {
					return await this.restoreOperation();
				} catch (error) {
					return this.fail(failure(error));
				}
			}
			async restoreOperation() {
				if (this.disposed) return this.refuse("disposed", "Assistant is closed.");
				if (this.starting || this.sending) return this.refuse("busy", "An assistant request is already pending.");
				this.invalid = false;
				this.awaitingPublication = false;
				this.error = void 0;
				this.historyFailed = false;
				this.sync();
				if (this.face && !this.invalid) return this.readHistory();
				return this.invalid ? {
					ok: false,
					error: this.error ?? {
						code: "missing-session",
						message: "Dedicated session is unavailable."
					}
				} : {
					ok: true,
					sessionId: this.address?.sessionId
				};
			}
			/** Replace the browser attachment only after the caller confirms; existing host history is retained. @param workspaceId - Explicit workspace. @param confirmed - User confirmed creating another conversation. @returns New session creation result. */
			async newConversation(workspaceId, confirmed) {
				if (!confirmed) return this.refuse("confirmation-required", "Confirm before starting another conversation.");
				if (this.disposed) return this.refuse("disposed", "Assistant is closed.");
				if (this.starting || this.sending) return this.refuse("busy", "An assistant request is already pending.");
				this.reset();
				return this.start(workspaceId);
			}
			/** Forget the browser address without deleting host history; a new start still needs a user action. */
			reset() {
				if (this.disposed || this.starting || this.sending) return;
				if (this.publicationTimer !== void 0) clearTimeout(this.publicationTimer);
				this.publicationTimer = void 0;
				this.clearHistory();
				this.address = void 0;
				this.awaitingPublication = false;
				this.invalid = false;
				this.error = void 0;
				try {
					this.storage?.removeItem(ASSISTANT_STORAGE_KEY);
				} catch {
					this.storageError = true;
				}
				this.sync();
			}
			/** Enqueue verbatim plain text via SessionFace.prompt. @param text - User draft, never copied from the main composer. @returns Queue receipt or structured refusal. */
			async send(text) {
				try {
					return await this.sendOperation(text);
				} catch (error) {
					return this.fail(failure(error));
				}
			}
			async sendOperation(text) {
				if (this.disposed) return this.refuse("disposed", "Assistant is closed.");
				if (this.sending || this.starting) return this.refuse("busy", "An assistant request is already pending.");
				if (!this.active) return this.refuse("disabled", "Assistant is disabled.");
				if (!text.trim()) return this.refuse("empty", "Enter a message.");
				if (text.trimStart().startsWith("/")) return this.refuse("slash", "Use the main session for slash commands.");
				if (this.services.connection.hostDescription.getSnapshot() === void 0) return this.refuse("disconnected", "Disconnected from DSH.");
				this.sync();
				if (this.snapshot.phase !== "ready" || !this.face || !this.address) return this.refuse("not-ready", "Open the dedicated session history before sending.");
				if (this.snapshot.pendingCount > 0) return this.refuse("interaction", "Resolve the pending interaction in the main session view.");
				const block = this.services.conversation.blocks.storeFor(this.address.sessionId).getSnapshot();
				if (block) return this.refuse("composer-blocked", block.reason);
				const face = this.face;
				this.sending = true;
				this.error = void 0;
				this.publish();
				try {
					const result = await face.prompt([{
						type: "text",
						text
					}], "queue");
					if (result.ok) {
						this.error = void 0;
						this.requestRefresh();
						return {
							ok: true,
							sessionId: face.sessionId
						};
					}
					return this.fail(result.error);
				} catch (error) {
					return this.fail(failure(error));
				} finally {
					this.sending = false;
					this.sync();
				}
			}
			/** Extend the dedicated session's authoritative history window. @returns Completion or refusal; no polling or retries. */
			async loadOlder() {
				try {
					return await this.olderOperation();
				} catch (error) {
					return this.fail(failure(error));
				}
			}
			async olderOperation() {
				if (this.disposed) return this.refuse("disposed", "Assistant is closed.");
				this.sync();
				if (this.historyRead || this.loadingOlder || this.snapshot.loadingOlder) return {
					ok: false,
					error: {
						code: "busy",
						message: "History is already loading."
					}
				};
				if (this.snapshot.phase !== "ready" || !this.face) return this.refuse("not-ready", "Open the dedicated session history first.");
				if (!this.historyHasMore || this.entries.length === 0) return { ok: true };
				return this.readHistory(this.entries[0].event.seq);
			}
			/** Explicit user navigation is the only action allowed to change the main selection. */
			reveal() {
				if (this.disposed) return;
				this.sync();
				if (this.address && !this.invalid && this.face) try {
					this.services.sessions.open(this.address.sessionId);
				} catch (error) {
					this.fail(failure(error));
				}
			}
			/** Detach listeners; host history and accepted agent work remain owned by DSH. */
			dispose() {
				if (this.disposed) return;
				this.disposed = true;
				if (this.publicationTimer !== void 0) clearTimeout(this.publicationTimer);
				this.clearHistory();
				this.listeners.clear();
				this.sessionDispose?.();
				this.blockDispose?.();
				for (const dispose of this.disposers) dispose();
			}
			workspace() {
				return this.services.workspaces.list.getSnapshot().items.find((item) => this.selected === void 0 ? item.path === this.address?.workspaceKey : item.workspaceId === this.selected);
			}
			baselinesReady() {
				return this.services.sessions.list.getSnapshot().phase === "ready" && this.services.workspaces.list.getSnapshot().baselinesReady;
			}
			sync() {
				if (this.disposed) return;
				try {
					this.reconcile();
				} catch (error) {
					this.historyFailed = true;
					this.error = failure(error);
					this.publish();
				}
			}
			reconcile() {
				if (this.disposed) return;
				const workspace = this.workspace();
				if (workspace && this.selected === void 0) this.selected = workspace.workspaceId;
				let face;
				if (this.address && !this.invalid && this.baselinesReady()) {
					const row = this.services.sessions.list.getSnapshot().byId[this.address.sessionId];
					if (row && workspace?.sessionIds.includes(this.address.sessionId) && row.title === titleFor(this.address.sessionId) && !row.origin && !row.parentId && row.cwd === this.address.workspaceKey) {
						this.awaitingPublication = false;
						if (this.publicationTimer !== void 0) clearTimeout(this.publicationTimer);
						this.publicationTimer = void 0;
						face = this.services.sessions.binding(this.address.sessionId)?.session;
						if (face?.getSnapshot().removed || face?.getSnapshot().subagent) {
							face = void 0;
							this.invalid = true;
						}
					} else if (!this.starting && (!this.awaitingPublication || !workspace || row && (row.origin || row.parentId || row.cwd !== this.address.workspaceKey))) {
						this.invalid = true;
						this.error = {
							code: "missing-session",
							message: "Saved assistant session is missing or no longer dedicated to this workspace. Explicitly start a new session."
						};
					}
				}
				if (face !== this.face) {
					this.sessionDispose?.();
					this.blockDispose?.();
					this.clearHistory();
					this.face = face;
					this.sessionDispose = face?.subscribe(() => this.sync());
					this.blockDispose = face && this.services.conversation.blocks.storeFor(face.sessionId).subscribe(() => this.publish());
				}
				const row = this.address ? this.services.sessions.list.getSnapshot().byId[this.address.sessionId] : void 0;
				const signature = face ? [
					face.sessionId,
					row?.updatedAt,
					row?.running,
					row?.pendingInteraction,
					face.getSnapshot().running,
					face.getSnapshot().queue.length
				].join(":") : "";
				if (signature !== this.signature) {
					this.signature = signature;
					this.requestRefresh();
				}
				this.scheduleRefresh();
				this.publish();
			}
			clearHistory() {
				this.generation++;
				this.historyAbort?.abort();
				if (this.refreshTimer !== void 0) clearTimeout(this.refreshTimer);
				this.refreshTimer = void 0;
				this.refreshQueued = false;
				this.signature = "";
				this.entries = [];
				this.permissionLabel = void 0;
				this.history = {
					messages: [],
					status: "idle"
				};
				this.historyReady = false;
				this.historyFailed = false;
				this.historyError = void 0;
				this.historyHasMore = false;
				this.loadingOlder = false;
			}
			isRunning() {
				const row = this.address ? this.services.sessions.list.getSnapshot().byId[this.address.sessionId] : void 0;
				return !!(this.face?.getSnapshot().running || row?.running);
			}
			scheduleRefresh() {
				if (!(!this.disposed && this.active && this.face && !this.invalid && !this.historyFailed && this.isRunning() && this.services.connection.hostDescription.getSnapshot() !== void 0)) {
					if (this.refreshTimer !== void 0) clearTimeout(this.refreshTimer);
					this.refreshTimer = void 0;
					return;
				}
				if (this.historyRead || this.refreshTimer !== void 0) return;
				this.refreshTimer = setTimeout(() => {
					this.refreshTimer = void 0;
					this.requestRefresh();
				}, this.refreshMs);
			}
			requestRefresh() {
				if (this.disposed || !this.active || !this.face || this.invalid || this.historyFailed || this.services.connection.hostDescription.getSnapshot() === void 0) return;
				if (this.historyRead) {
					this.refreshQueued = true;
					return;
				}
				this.readHistory();
			}
			readHistory(beforeSeq) {
				if (this.historyRead) return this.historyRead;
				if (this.disposed || !this.active || !this.address || !this.face || this.invalid || this.services.connection.hostDescription.getSnapshot() === void 0) return Promise.resolve({
					ok: false,
					error: {
						code: "not-ready",
						message: "Dedicated session is unavailable."
					}
				});
				if (this.refreshTimer !== void 0) clearTimeout(this.refreshTimer);
				this.refreshTimer = void 0;
				const sessionId = this.address.sessionId;
				const generation = this.generation;
				const abort = new AbortController();
				this.historyAbort = abort;
				this.loadingOlder = beforeSeq !== void 0;
				const work = Promise.resolve().then(async () => {
					try {
						if (generation !== this.generation || this.disposed) return {
							ok: false,
							error: {
								code: "superseded",
								message: "History request was superseded."
							}
						};
						const result = (await this.services.connection.api.sessions.history({
							sessionId,
							...beforeSeq === void 0 ? {} : { beforeSeq }
						}, abort.signal)).result;
						if (generation !== this.generation || this.disposed) return {
							ok: false,
							error: {
								code: "superseded",
								message: "History request was superseded."
							}
						};
						if (!result.ok) {
							this.historyFailed = true;
							this.historyError = result.error;
							return {
								ok: false,
								error: result.error
							};
						}
						if (beforeSeq === void 0) {
							const values = result.value.projections?.values;
							const permission = typeof values === "object" && values !== null && "permissions" in values ? values.permissions : void 0;
							this.permissionLabel = typeof permission === "object" && permission !== null && "currentValue" in permission && typeof permission.currentValue === "string" ? permission.currentValue : void 0;
						}
						let incoming = result.value.events;
						let more = result.value.hasMore;
						const oldTail = this.entries.at(-1)?.event.seq;
						while (beforeSeq === void 0 && oldTail !== void 0 && incoming[0] && incoming[0].event.seq > oldTail + 1 && more) {
							const cursor = incoming[0].event.seq;
							const older = (await this.services.connection.api.sessions.history({
								sessionId,
								beforeSeq: cursor
							}, abort.signal)).result;
							if (generation !== this.generation || this.disposed) return {
								ok: false,
								error: {
									code: "superseded",
									message: "History request was superseded."
								}
							};
							if (!older.ok) {
								this.historyFailed = true;
								this.historyError = older.error;
								return {
									ok: false,
									error: older.error
								};
							}
							if (!older.value.events.length || older.value.events[0].event.seq >= cursor) throw new Error("Host history did not advance its cursor.");
							incoming = [...older.value.events, ...incoming];
							more = older.value.hasMore;
						}
						if (beforeSeq === void 0 && oldTail !== void 0 && incoming[0] && incoming[0].event.seq > oldTail + 1) throw new Error("Host history has an unrecoverable gap.");
						if (beforeSeq !== void 0 && incoming.length && incoming.at(-1).event.seq + 1 !== beforeSeq) throw new Error("Host history page is not contiguous.");
						const oldFirst = this.entries[0]?.event.seq;
						const merged = new Map(this.entries.map((entry) => [entry.event.seq, entry]));
						for (const entry of incoming) merged.set(entry.event.seq, entry);
						this.entries = [...merged.values()].sort((a, b) => a.event.seq - b.event.seq);
						if (oldFirst === void 0 || beforeSeq !== void 0 || incoming[0] && incoming[0].event.seq <= oldFirst) this.historyHasMore = more;
						this.history = projectAssistantHistory(this.entries);
						this.historyReady = true;
						this.historyFailed = false;
						this.historyError = void 0;
						return {
							ok: true,
							sessionId
						};
					} catch (error) {
						if (generation !== this.generation || this.disposed) return {
							ok: false,
							error: {
								code: "superseded",
								message: "History request was superseded."
							}
						};
						this.historyFailed = true;
						this.historyError = failure(error);
						return {
							ok: false,
							error: this.historyError
						};
					} finally {
						this.historyRead = void 0;
						this.historyAbort = void 0;
						this.loadingOlder = false;
						if (!this.disposed) {
							this.publish();
							if (this.refreshQueued && !this.historyFailed) {
								this.refreshQueued = false;
								this.requestRefresh();
							} else this.scheduleRefresh();
						}
					}
				});
				this.historyRead = work;
				this.publish();
				return work;
			}
			buildSnapshot() {
				const state = this.face?.getSnapshot();
				const workspace = this.workspace();
				const row = this.address ? this.services.sessions.list.getSnapshot().byId[this.address.sessionId] : void 0;
				const phase = this.starting ? "creating" : this.invalid ? "unavailable" : !this.address ? this.error && !["empty", "slash"].includes(this.error.code) ? "unavailable" : "empty" : this.historyFailed ? "unavailable" : !this.baselinesReady() || !state || !this.historyReady ? "restoring" : "ready";
				const pending = state?.openState === "open" ? state.pending : [];
				const pendingCount = Math.max(pending.length, row?.pendingInteraction ? 1 : 0);
				const composerBlock = this.face ? this.services.conversation.blocks.storeFor(this.face.sessionId).getSnapshot() : void 0;
				const blockedReason = this.services.connection.hostDescription.getSnapshot() === void 0 ? "Disconnected from DSH." : !this.active ? "Assistant is disabled." : phase !== "ready" ? "Assistant session is not ready." : this.sending ? "A message is being submitted." : pendingCount > 0 ? "Resolve the pending interaction in the main session view." : composerBlock?.reason;
				const lastAssistant = state?.nodes.filter((node) => node.kind === "assistant").at(-1);
				const model = this.history.model ?? lastAssistant?.provenance?.model ?? lastAssistant?.requestConfig?.model;
				let status = this.history.status === "running" ? "idle" : this.history.status;
				if (phase === "empty") status = "noSession";
				else if (phase === "creating" || phase === "restoring") status = "loading";
				else if (phase === "unavailable") status = "unavailable";
				else if (row?.pendingInteraction === "plan-review") status = "review";
				else if (row?.pendingInteraction === "question" || pending.some((wait) => wait.kind === "question")) status = "question";
				else if (pendingCount > 0) status = "approval";
				else if (this.isRunning()) status = "running";
				else if (state?.queue.length) status = "queued";
				else if (state?.lastAgentError && this.history.status !== "completed") status = "failed";
				return {
					phase,
					status,
					canSend: blockedReason === void 0,
					blockedReason,
					needsReveal: false,
					workspacePath: workspace?.path,
					modelLabel: model,
					permissionLabel: this.permissionLabel ?? "Host session permissions (not overridden by Firefly)",
					workspaceId: this.selected,
					workspace,
					workspaces: this.services.workspaces.list.getSnapshot().items,
					sessionId: this.address?.sessionId,
					messages: this.history.messages,
					running: this.isRunning(),
					sending: this.sending,
					pendingCount,
					queuedCount: state?.queue.length ?? 0,
					hasMore: this.historyHasMore,
					loadingOlder: this.loadingOlder,
					preset: row?.agentPreset,
					model,
					permissions: "host-session-settings",
					error: this.error ?? this.historyError ?? state?.promptError?.error ?? (state?.lastAgentError && this.history.status !== "completed" ? {
						code: "agent-error",
						message: state.lastAgentError
					} : void 0) ?? (this.history.error ? {
						code: "turn-error",
						message: this.history.error
					} : void 0),
					storageError: this.storageError
				};
			}
			publish() {
				if (this.disposed) return;
				try {
					this.snapshot = this.buildSnapshot();
				} catch (error) {
					this.snapshot = {
						...this.snapshot,
						phase: "unavailable",
						canSend: false,
						error: failure(error),
						blockedReason: "Session provider is unavailable."
					};
				}
				for (const listener of this.listeners) try {
					listener();
				} catch (error) {
					console.error("[firefly-assistant] snapshot listener failed", error);
				}
			}
			refuse(code, message) {
				return this.fail({
					code,
					message
				});
			}
			fail(error) {
				if (!this.disposed) {
					this.error = error;
					this.publish();
				}
				return {
					ok: false,
					error
				};
			}
		};
		//#endregion
		//#region src/client/view-store.ts
		/** @returns The root-owned panel state; message history belongs to DSH, never this store. */
		function createViewStore() {
			return (0, _deepseek_ai_dsh_client_runtime_client.defineStore)({
				init: () => ({
					expanded: false,
					draft: {
						text: "",
						revision: 0
					}
				}),
				actions: {
					expand(state, expanded) {
						state.expanded = expanded;
					},
					editDraft(state, text) {
						state.draft = {
							text,
							revision: state.draft.revision + 1
						};
					},
					accepted(state, revision) {
						if (state.draft.revision === revision) state.draft = {
							text: "",
							revision: revision + 1
						};
					}
				}
			});
		}
		//#endregion
		//#region src/client/preferences.ts
		/** Storage key scoped to this plugin and origin. */
		const STORAGE_KEY = "dsh.firefly-assistant.v1";
		function decode(raw, defaults) {
			if (raw === null) return { ...defaults };
			const value = JSON.parse(raw);
			if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error("Invalid Firefly preferences");
			const record = value;
			if (record.version !== 1 || typeof record.enabled !== "boolean" || typeof record.right !== "number" || !Number.isFinite(record.right) || record.right < 0 || typeof record.bottom !== "number" || !Number.isFinite(record.bottom) || record.bottom < 0) throw new Error("Invalid Firefly preferences");
			return {
				enabled: record.enabled,
				right: record.right,
				bottom: record.bottom
			};
		}
		/**
		* Preference store with an in-memory fallback for denied or corrupt browser storage.
		* @param storage - Browser storage, or null when the browser denies access.
		* @param defaults - Validated deployment defaults.
		*/
		var PreferencesStore = class {
			storage;
			defaults;
			snapshot;
			listeners = /* @__PURE__ */ new Set();
			constructor(storage, defaults) {
				this.storage = storage;
				this.defaults = defaults;
				let values = { ...defaults };
				let storageUnavailable = storage === null;
				if (storage !== null) try {
					values = decode(storage.getItem(STORAGE_KEY), defaults);
				} catch {
					storageUnavailable = true;
				}
				this.snapshot = {
					values,
					storageUnavailable
				};
			}
			/** @returns The cached snapshot; identity changes only when preferences change. */
			getSnapshot = () => this.snapshot;
			/**
			* Subscribe to preference changes.
			* @param listener - Synchronous render notification.
			* @returns The listener disposer.
			*/
			subscribe = (listener) => {
				this.listeners.add(listener);
				return () => {
					this.listeners.delete(listener);
				};
			};
			/**
			* Persist a partial preference edit without changing task permissions.
			* @param patch - New visibility or position values.
			*/
			update(patch) {
				const values = {
					...this.snapshot.values,
					...patch
				};
				if (values.enabled === this.snapshot.values.enabled && values.right === this.snapshot.values.right && values.bottom === this.snapshot.values.bottom) return;
				let storageUnavailable = this.storage === null;
				if (this.storage !== null) try {
					this.storage.setItem(STORAGE_KEY, JSON.stringify({
						version: 1,
						...values
					}));
				} catch {
					storageUnavailable = true;
				}
				this.snapshot = {
					values,
					storageUnavailable
				};
				for (const listener of this.listeners) listener();
			}
			/** Restore the configured position without changing the visibility preference. */
			resetPosition() {
				this.update({
					right: this.defaults.right,
					bottom: this.defaults.bottom
				});
			}
		};
		//#endregion
		//#region src/client/locales.ts
		/** Plugin-owned Chinese UI copy. */
		const zh = {
			"studio.subtitle": "FIREFLY STUDIO · 独立对话",
			"studio.description": "三位像素小人在自己的工位上，动作反映同一个助手的状态，不代表真实多代理任务。",
			"studio.idle": "工位就绪，等你的新想法",
			"studio.working": "正在忙碌，把想法变成进展",
			"studio.waiting": "暂时停下，等你确认",
			"studio.error": "遇到问题，先检查一下",
			"studio.visual": "状态小剧场",
			"studio.welcome": "欢迎来到流萤工作室",
			"studio.intro": "把问题留在这里，我们一起慢慢解决。",
			"chat.eyebrow": "YOUR PERSONAL COMPANION",
			"chat.welcome": "今天，想一起做些什么？",
			"chat.intro": "这里是只属于这段对话的空间。\n想法、问题，或一个新的开始。",
			"chat.workspace": "关联工作区",
			"chat.chooseWorkspace": "选择一个工作区",
			"chat.setupNote": "采用 DSH 默认策略，不读取主聊天。",
			"chat.start": "开始独立对话",
			"chat.emptyWorkspace": "请先在 DSH 中添加一个工作区。",
			"chat.you": "你",
			"chat.assistant": "流萤",
			"chat.thinking": "正在回应…",
			"chat.toolRunning": "正在处理，请稍候…",
			"chat.older": "加载更早的消息",
			"chat.restoring": "正在恢复独立对话…",
			"chat.starting": "正在建立专属会话…",
			"chat.isolated": "独立上下文",
			"chat.new": "新对话",
			"chat.newConfirm": "开启新的独立对话？原会话仍会保留在 DSH 中。",
			"chat.confirm": "确认新建",
			"chat.cancel": "取消",
			"chat.pending": "需要你的确认或回答，请打开专属会话处理。",
			"chat.refresh": "重新加载对话",
			"chat.error": "对话暂不可用",
			"chat.reset": "选择工作区，重新开始",
			"chat.missing": "原会话已不可用，不会自动创建或改发到主会话。",
			"chat.historyHint": "消息记录保存在 DSH，刷新后恢复",
			"chat.defaultPolicy": "DSH 默认会话策略",
			"chat.latest": "回到最新消息",
			"title": "Firefly 助手",
			"subtitle": "独立对话 · 与主会话分开",
			"open": "打开 Firefly 助手",
			"close": "收起 Firefly 助手",
			"drag": "拖动助手；方向键微调位置",
			"current": "当前会话",
			"noTitle": "尚未选择会话",
			"placeholder": "说说你的想法…",
			"input": "和流萤对话",
			"send": "发送消息",
			"queue": "加入队列",
			"sending": "提交中…",
			"accepted": "消息已接收",
			"failure": "提交未确认：{message}。为避免重复执行，不会自动重试。",
			"reveal": "打开完整会话",
			"safety": "使用专属会话权限",
			"shortcut": "Enter 发送 · Shift + Enter 换行",
			"plainText": "仅发送文本；命令与附件请使用主输入框。",
			"suggest.analyze": "分析项目",
			"suggest.test": "排查测试",
			"suggest.summary": "总结进展",
			"prompt.analyze": "请先只读分析当前项目的结构，并给出下一步建议，不修改文件。",
			"prompt.test": "请分析当前项目的测试配置与已有失败信息，先给出排查方案，不修改文件。",
			"prompt.summary": "请总结当前会话的进展、待办事项和下一步建议。",
			"settings.description": "显示页面悬浮入口。位置和开关仅保存在此浏览器，不改变任务权限。",
			"settings.enabled": "显示 Firefly 助手",
			"settings.reset": "恢复默认位置",
			"storage": "浏览器未能保存偏好；当前页面仍可正常使用。",
			"status.noSession": "等待开始",
			"status.loading": "正在加载会话",
			"status.unavailable": "会话不可用",
			"status.question": "等待你的回答",
			"status.approval": "等待你的审批",
			"status.review": "等待计划确认",
			"status.running": "DSH 正在处理",
			"status.queued": "任务等待处理",
			"status.idle": "准备就绪",
			"status.completed": "上一轮已完成",
			"status.failed": "当前会话发生错误",
			"status.stopped": "上一轮已停止",
			"status.limited": "上一轮达到输出上限",
			"status.blocked": "上一轮未能继续",
			"block.noSession": "请先在 DSH 中选择一个会话。",
			"block.selectionChanged": "会话已切换，请确认当前目标后重新发送。",
			"block.loading": "会话尚未就绪，请稍后再试。",
			"block.unavailable": "会话已移除或加载失败，请在聊天区检查。",
			"block.subagent": "首版仅向普通会话发送任务，请返回主会话。",
			"block.interaction": "请先在聊天区处理待确认的审批、计划或提问。",
			"block.workspace": "请先在主界面选择工作区。",
			"block.composerBlocked": "当前会话暂时无法接收任务。",
			"block.empty": "请先填写任务内容。",
			"block.slash": "斜杠命令请在专属完整会话中执行。",
			"block.sending": "正在提交，请勿重复发送。",
			"block.disabled": "Firefly 已关闭，请在设置中重新启用。"
		};
		/** Plugin-owned English UI copy. */
		const en = {
			"studio.subtitle": "FIREFLY STUDIO · Independent chat",
			"studio.description": "Three pixel coworkers at their desks reflect one assistant’s status, not separate agents.",
			"studio.idle": "Desks ready for your next idea",
			"studio.working": "At work on your next idea",
			"studio.waiting": "Taking a pause for your input",
			"studio.error": "A pause to check what went wrong",
			"studio.visual": "Status illustration",
			"studio.welcome": "Welcome to Firefly Studio",
			"studio.intro": "A small space for your ideas and questions.",
			"chat.eyebrow": "YOUR PERSONAL COMPANION",
			"chat.welcome": "What shall we explore today?",
			"chat.intro": "A space for this conversation alone.\nAn idea, a question, or a fresh start.",
			"chat.workspace": "Workspace",
			"chat.chooseWorkspace": "Choose a workspace",
			"chat.setupNote": "Uses DSH session defaults; no main-chat history.",
			"chat.start": "Start independent conversation",
			"chat.emptyWorkspace": "Add a workspace in DSH first.",
			"chat.you": "You",
			"chat.assistant": "Firefly",
			"chat.thinking": "Preparing a response…",
			"chat.toolRunning": "Working on it…",
			"chat.older": "Load earlier messages",
			"chat.restoring": "Restoring your conversation…",
			"chat.starting": "Creating your conversation…",
			"chat.isolated": "Separate context",
			"chat.new": "New conversation",
			"chat.newConfirm": "Start a new conversation? The previous one remains in DSH.",
			"chat.confirm": "Start new",
			"chat.cancel": "Cancel",
			"chat.pending": "Your approval or answer is needed. Open this conversation to respond.",
			"chat.refresh": "Reload conversation",
			"chat.error": "Conversation unavailable",
			"chat.reset": "Choose workspace and start again",
			"chat.missing": "The saved session is unavailable. Nothing will be sent to the main conversation.",
			"chat.historyHint": "History saved in DSH and restored after refresh",
			"chat.defaultPolicy": "DSH session defaults",
			"chat.latest": "Jump to latest",
			"title": "Firefly Assistant",
			"subtitle": "Independent conversation",
			"open": "Open Firefly Assistant",
			"close": "Collapse Firefly Assistant",
			"drag": "Drag assistant; use arrow keys to adjust position",
			"current": "Current conversation",
			"noTitle": "No conversation selected",
			"placeholder": "What’s on your mind?",
			"input": "Message Firefly",
			"send": "Send message",
			"queue": "Add to queue",
			"sending": "Submitting…",
			"accepted": "Message received",
			"failure": "Submission unconfirmed: {message}. No automatic retry to avoid duplicate work.",
			"reveal": "Open full conversation",
			"safety": "Dedicated session permissions",
			"shortcut": "Enter to send · Shift + Enter for a new line",
			"plainText": "Text only; use the main composer for commands and attachments.",
			"suggest.analyze": "Explore project",
			"suggest.test": "Investigate tests",
			"suggest.summary": "Summarize",
			"prompt.analyze": "Read-only: analyze this project’s structure and suggest next steps. Do not modify files.",
			"prompt.test": "Analyze this project’s test setup and existing failure information. Suggest a debugging plan without modifying files.",
			"prompt.summary": "Summarize this conversation’s progress, remaining tasks, and suggested next steps.",
			"settings.description": "Show the floating launcher. Position and visibility stay in this browser and never change task permissions.",
			"settings.enabled": "Show Firefly Assistant",
			"settings.reset": "Reset position",
			"storage": "Browser preferences could not be saved; this page remains usable.",
			"status.noSession": "Ready to begin",
			"status.loading": "Loading conversation",
			"status.unavailable": "Conversation unavailable",
			"status.question": "Waiting for your answer",
			"status.approval": "Waiting for approval",
			"status.review": "Waiting for plan review",
			"status.running": "DSH is working",
			"status.queued": "Work is queued",
			"status.idle": "Ready when you are",
			"status.completed": "Last turn completed",
			"status.failed": "Conversation error",
			"status.stopped": "Last turn stopped",
			"status.limited": "Last turn hit its output limit",
			"status.blocked": "Last turn could not continue",
			"block.noSession": "Select a conversation in DSH first.",
			"block.selectionChanged": "The conversation changed. Confirm the target before sending again.",
			"block.loading": "The conversation is not ready. Try again shortly.",
			"block.unavailable": "The conversation was removed or could not load. Check the main chat.",
			"block.subagent": "The MVP sends only to ordinary conversations. Return to the parent conversation.",
			"block.interaction": "Resolve the pending approval, plan review, or question in chat first.",
			"block.workspace": "Choose a workspace in the main interface first.",
			"block.composerBlocked": "This conversation cannot receive a task yet.",
			"block.empty": "Enter a task first.",
			"block.slash": "Run slash commands in the full dedicated conversation.",
			"block.sending": "A submission is in progress. Please do not send twice.",
			"block.disabled": "Firefly is disabled. Re-enable it in Settings."
		};
		//#endregion
		//#region src/client/firefly.css?inline
		var firefly_default = "[data-firefly-root] {\n  --ff-accent: #397e66;\n  --ff-ink: #2e4439;\n  --ff-muted: #758777;\n  --ff-line: rgb(105 135 111 / 18%);\n  --dsw-alias-label-primary: #2e4439;\n  --dsw-alias-label-secondary: #607668;\n  --dsw-alias-label-tertiary: #718575;\n  --dsw-alias-bg-base: #f6f7f0;\n  --dsw-alias-markdown-code-block: #e8eee3;\n  --dsw-alias-markdown-code-block-banner: #dfe8da;\n  --dsw-alias-markdown-inline-code: #e4ebdd;\n  --dsw-alias-state-business-primary: #397e66;\n  color: var(--ff-ink);\n  color-scheme: light;\n  font: 13px/1.6 var(--dsw-font-family, system-ui, sans-serif);\n}\n[data-firefly-root] *, [data-firefly-settings] * { box-sizing: border-box; }\n[data-firefly-root] button, [data-firefly-root] textarea, [data-firefly-root] select { font: inherit; }\n[data-firefly-root] button { cursor: pointer; }\n[data-firefly-root] button:disabled { cursor: default; opacity: .38; }\n[data-firefly-root] button:focus-visible, [data-firefly-root] select:focus-visible { outline: 2px solid var(--ff-accent); outline-offset: 3px; }\n[data-firefly-root].dsh-firefly-assistant-dock { position: fixed; z-index: 50; display: flex; flex-direction: column; align-items: flex-end; gap: 8px; max-width: calc(100vw - 16px); pointer-events: none; }\n[data-firefly-root] .ff-panel {\n  position: relative; isolation: isolate; width: min(464px, calc(100vw - 16px));\n  height: min(720px, calc(100dvh - 110px)); max-height: calc(100dvh - 110px);\n  display: flex; flex-direction: column; overflow: hidden; pointer-events: auto;\n  border: 1px solid rgb(129 153 129 / 32%); border-radius: 20px;\n  background: linear-gradient(145deg, rgb(252 252 246 / 98%), rgb(240 245 232 / 97%));\n  -webkit-backdrop-filter: blur(17px) saturate(115%); backdrop-filter: blur(17px) saturate(115%);\n  box-shadow: 0 20px 65px rgb(47 65 46 / 18%), 0 3px 12px rgb(47 65 46 / 8%), inset 0 1px 0 rgb(255 255 255 / 8%);\n}\n[data-firefly-root] .ff-panel::before { content: ''; position: absolute; z-index: -1; pointer-events: none; left: -40%; top: -220px; width: 600px; height: 340px; border-radius: 50%; background: radial-gradient(ellipse, rgb(112 184 153 / 12%), transparent 65%); }\n[data-firefly-root] .ff-header { flex: none; display: flex; align-items: center; gap: 10px; padding: 17px 18px 13px; }\n[data-firefly-root] .ff-wordmark { display: flex; gap: 9px; align-items: center; min-width: 0; flex: 1; }\n[data-firefly-root] .ff-header-device { width: 35px; height: 38px; display: grid; place-items: center; }\n[data-firefly-root] h2 { margin: 0; font-size: 14px; font-weight: 560; letter-spacing: .06em; }\n[data-firefly-root] .ff-subtitle { color: var(--ff-muted); font-size: 10px; margin: 1px 0 0; letter-spacing: .06em; }\n[data-firefly-root] .ff-header-actions { display: flex; gap: 2px; }\n[data-firefly-root] .ff-icon { width: 27px; height: 29px; display: grid; place-items: center; padding: 0; color: #758b77; background: none; border: none; border-radius: 7px; }\n[data-firefly-root] .ff-icon:hover:not(:disabled) { background: rgb(227 240 234 / 8%); color: #304836; }\n[data-firefly-root] .ff-grip { cursor: grab; touch-action: none; }\n[data-firefly-root] .ff-grip:active { cursor: grabbing; }\n[data-firefly-root] .ff-context { flex: none; display: flex; align-items: center; flex-wrap: wrap; gap: 6px; margin: 0 20px; padding: 0 0 12px; border-bottom: 1px solid var(--ff-line); color: var(--ff-muted); font-size: 10px; }\n[data-firefly-root] .ff-context-path { max-width: 190px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n[data-firefly-root] .ff-context-divider { color: #adb8a4; }\n[data-firefly-root] .ff-status { display: inline-flex; align-items: center; gap: 6px; color: var(--ff-accent); font-size: 10px; }\n[data-firefly-root] .ff-status-dot { display: inline-block; width: 4px; height: 4px; flex: none; background: currentColor; border-radius: 50%; box-shadow: 0 0 7px rgb(128 232 192 / 30%); }\n[data-firefly-root] .ff-scroll { flex: 1; min-height: 0; overflow: auto; padding: 15px 20px; overscroll-behavior: contain; scrollbar-width: thin; scrollbar-color: #b5c4ac transparent; }\n[data-firefly-root] .ff-welcome { display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding: 4px 6px 16px; text-align: center; }\n[data-firefly-root] .ff-welcome h3 { margin: 0 0 8px; font-size: 17px; line-height: 1.5; font-weight: 450; letter-spacing: .01em; color: #304b38; }\n[data-firefly-root] .ff-welcome p { margin: 0; max-width: 280px; color: #70816c; font-size: 12px; line-height: 1.9; }\n[data-firefly-root] .ff-eyebrow { display: block; margin-bottom: 9px; color: #6d8d77; font-size: 9px; letter-spacing: .19em; text-transform: uppercase; }\n[data-firefly-root] .ff-setup { margin-top: 16px; width: 100%; text-align: left; }\n[data-firefly-root] .ff-setup label { display: block; color: var(--ff-muted); font-size: 11px; margin: 0 0 7px; }\n[data-firefly-root] .ff-setup select { width: 100%; height: 38px; border: 1px solid #ccd7c0; border-radius: 10px; background: #f9fbf4; color: var(--ff-ink); padding: 0 10px; }\n[data-firefly-root] .ff-setup option { background: #f8faf1; color: #2e4439; }\n[data-firefly-root] .ff-start { margin-top: 10px; width: 100%; border: 1px solid rgb(204 233 220 / 35%); color: #13281e; background: linear-gradient(120deg, #b4dac5, #8bcab2); padding: 9px 12px; font-size: 12px; font-weight: 550; border-radius: 10px; }\n[data-firefly-root] .ff-start:hover:not(:disabled) { background: #b6e4cf; }\n[data-firefly-root] .ff-setup-note { margin-top: 10px !important; font-size: 10px !important; line-height: 1.65 !important; opacity: .8; }\n[data-firefly-root] .ff-suggestions { display: flex; justify-content: center; flex-wrap: wrap; gap: 7px; margin: 24px 0 0; }\n[data-firefly-root] .ff-suggestions button { background: #edf3e6; border: 1px solid #d5e0cb; color: #5c7a61; font-size: 11px; padding: 6px 11px; border-radius: 9px; transition: background .2s, border-color .2s; }\n[data-firefly-root] .ff-suggestions button:hover { background: rgb(175 213 193 / 12%); border-color: #719785; }\n[data-firefly-root] .ff-message { margin: 0 0 21px; }\n[data-firefly-root] .ff-message-author { display: flex; gap: 7px; align-items: center; margin-bottom: 7px; color: #52856b; font-size: 10px; letter-spacing: .035em; }\n[data-firefly-root] .ff-user { display: flex; justify-content: flex-end; }\n[data-firefly-root] .ff-user-text { max-width: 91%; padding: 10px 13px; background: #e2ecd9; border: 1px solid #d6e3cb; border-radius: 14px 14px 4px 14px; white-space: pre-wrap; overflow-wrap: anywhere; color: #344d3c; font-size: 12px; }\n[data-firefly-root] .ff-message-body { color: #34483a; font-size: 12px; line-height: 1.85; overflow-wrap: anywhere; min-width: 0; }\n[data-firefly-root] .ff-message-body > * { font-size: inherit; line-height: inherit; }\n[data-firefly-root] .ff-message-body pre { max-width: 100%; font-size: 11px; }\n[data-firefly-root] .ff-message-body h1, [data-firefly-root] .ff-message-body h2, [data-firefly-root] .ff-message-body h3 { font-size: 14px; }\n[data-firefly-root] .ff-message-body img { max-width: 100%; }\n[data-firefly-root] .ff-typing { display: inline-flex; gap: 4px; padding: 8px 0; }\n[data-firefly-root] .ff-typing i { width: 4px; height: 4px; background: #a1d9bc; border-radius: 50%; animation: ff-dot 2.4s ease-in-out infinite; }\n[data-firefly-root] .ff-typing i:nth-child(2) { animation-delay: .25s; }\n[data-firefly-root] .ff-typing i:nth-child(3) { animation-delay: .5s; }\n@keyframes ff-dot { 0%, 100% { opacity: .35; } 50% { opacity: 1; } }\n[data-firefly-root] .ff-activity { padding: 8px 0; font-size: 11px; color: #73896d; display: flex; align-items: center; gap: 7px; }\n[data-firefly-root] .ff-activity [data-spinner] { width: 10px; height: 10px; border: 1px solid rgb(161 228 205 / 25%); border-top-color: #397e66; border-radius: 50%; animation: ff-spin 2s linear infinite; }\n@keyframes ff-spin { to { transform: rotate(360deg); } }\n[data-firefly-root] .ff-compose-area { flex: none; padding: 0 14px 13px; }\n[data-firefly-root] .ff-compose { background: rgb(255 255 255 / 85%); border: 1px solid #c9d8c0; border-radius: 16px; transition: border-color .2s; }\n[data-firefly-root] .ff-compose:focus-within { border-color: rgb(160 218 189 / 42%); box-shadow: 0 0 0 2px rgb(138 207 174 / 3%); }\n[data-firefly-root] textarea { display: block; width: 100%; height: 68px; min-height: 54px; max-height: 136px; margin: 0; padding: 13px 14px 5px; resize: vertical; border: 0; outline: 0; color: #344d3c; -webkit-text-fill-color: #344d3c; caret-color: #397e66; background: transparent; font-size: 12px; line-height: 1.65; }\n[data-firefly-root] .ff-compose textarea:focus,\n[data-firefly-root] .ff-compose textarea:focus-visible { outline: none !important; box-shadow: none !important; border: 0 !important; }\n[data-firefly-root] textarea::placeholder { color: #8c9c82; -webkit-text-fill-color: #8c9c82; opacity: 1; }\n[data-firefly-root] .ff-compose-footer { display: flex; align-items: center; gap: 8px; padding: 5px 8px 8px 13px; }\n[data-firefly-root] .ff-compose-hint { color: #8a9a80; font-size: 9px; flex: 1; }\n[data-firefly-root] .ff-send { display: grid; place-items: center; width: 31px; height: 31px; flex: none; border: 0; border-radius: 10px; color: #fff; background: #719b72; }\n[data-firefly-root] .ff-send:hover:not(:disabled) { background: #c3ead4; }\n[data-firefly-root] .ff-footer-line { display: flex; align-items: center; justify-content: space-between; margin: 8px 6px 0; font-size: 9px; color: #889780; }\n[data-firefly-root] .ff-chat-link, [data-firefly-root] .ff-load-more { border: none; color: #598364; background: none; padding: 0; font-size: 10px; }\n[data-firefly-root] .ff-load-more { display: block; margin: 0 auto 18px; }\n[data-firefly-root] .ff-chat-link:hover, [data-firefly-root] .ff-load-more:hover { color: #3f7051; text-decoration: underline; text-underline-offset: 3px; }\n[data-firefly-root] .ff-notice { margin: 0 0 10px; padding: 9px 11px; border: 1px solid rgb(228 180 99 / 18%); border-radius: 10px; color: #856b41; background: rgb(213 161 81 / 5%); font-size: 11px; overflow-wrap: anywhere; }\n[data-firefly-root] .ff-notice[data-error] { color: #a25b55; border-color: rgb(210 134 134 / 25%); background: rgb(146 75 75 / 7%); }\n[data-firefly-root] .ff-notice button { color: inherit; }\n[data-firefly-root] .ff-confirm { padding: 15px 18px; background: #e7eee0; border-bottom: 1px solid #d0dcc5; font-size: 12px; flex: none; }\n[data-firefly-root] .ff-confirm p { margin: 0 0 8px; }\n[data-firefly-root] .ff-confirm-actions { display: flex; gap: 12px; }\n[data-firefly-root] .ff-confirm button { border: 1px solid #667f6e; border-radius: 7px; background: none; color: #456044; padding: 4px 12px; }\n[data-firefly-root] .ff-launcher { position: relative; display: grid; place-items: center; width: 84px; height: 84px; padding: 0; flex: none; border: 0; border-radius: 24px; background: none; color: #d3f5e5; touch-action: none; pointer-events: auto; isolation: isolate; }\n[data-firefly-root] .ff-launcher svg { filter: drop-shadow(0 6px 5px rgb(0 0 0 / 35%)); transition: transform .4s ease; }\n[data-firefly-root] .ff-launcher:hover svg { transform: translateY(-2px); }\n[data-firefly-root] .ff-launcher .ff-device-core { animation: ff-core-breathe 4s ease-in-out infinite alternate; }\n@keyframes ff-core-breathe { from { opacity: .7; } to { opacity: 1; } }\n[data-firefly-root] .ff-launcher .ff-device-wing { transform-origin: center; transition: opacity .5s; opacity: .8; }\n[data-firefly-root] .ff-launcher:hover .ff-device-wing { opacity: 1; }\n[data-firefly-root] .ff-orb-dot { position: absolute; bottom: 10px; right: 15px; height: 4px; width: 4px; background: #a7e9c7; border-radius: 50%; }\n[data-firefly-root][data-state='question'] .ff-orb-dot, [data-firefly-root][data-state='approval'] .ff-orb-dot { background: #e5b96b; }\n[data-firefly-root][data-state='failed'] .ff-orb-dot { background: #de9696; }\n[data-firefly-settings] { font: 13px/1.6 var(--dsw-font-family, system-ui, sans-serif); color: var(--dsw-alias-label-primary, #293931); padding: 16px 0; }\n[data-firefly-settings] .ff-settings-heading { display: flex; align-items: center; justify-content: space-between; gap: 20px; }\n[data-firefly-settings] .ff-settings-title { font-size: 14px; font-weight: 550; }\n[data-firefly-settings] p { margin: 6px 0 0; max-width: 420px; color: var(--dsw-alias-label-secondary, #63766b); font-size: 12px; }\n[data-firefly-settings] .ff-switch { position: relative; width: 38px; height: 22px; display: inline-flex; flex: none; }\n[data-firefly-settings] .ff-switch input { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; margin: 0; }\n[data-firefly-settings] .ff-switch span { pointer-events: none; width: 38px; height: 22px; border-radius: 20px; background: #71897c; }\n[data-firefly-settings] .ff-switch span::after { content: ''; display: block; width: 16px; height: 16px; margin: 3px; background: #eef7f1; border-radius: 50%; transition: transform .2s; }\n[data-firefly-settings] .ff-switch input:checked + span { background: #357b62; }\n[data-firefly-settings] .ff-switch input:checked + span::after { transform: translateX(16px); }\n[data-firefly-settings] .ff-switch input:focus-visible + span { outline: 2px solid #428469; outline-offset: 3px; }\n[data-firefly-settings] .ff-reset { font: inherit; background: transparent; border: 1px solid #81968a; border-radius: 8px; color: inherit; padding: 5px 10px; margin-top: 12px; cursor: pointer; }\n@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) { [data-firefly-root] .ff-panel { background: #202b26; } }\n@media (prefers-reduced-motion: reduce) { [data-firefly-root] *, [data-firefly-root] *::before, [data-firefly-settings] *::after { animation: none !important; transition: none !important; } }\n@media (max-height: 520px) { [data-firefly-root] .ff-panel { height: calc(100dvh - 94px); max-height: calc(100dvh - 94px); border-radius: 16px; } [data-firefly-root] .ff-header { padding: 8px 14px; } [data-firefly-root] .ff-context { padding-bottom: 5px; } [data-firefly-root] .ff-compose-area { padding-bottom: 7px; } [data-firefly-root] .ff-launcher { height: 68px; width: 68px; } [data-firefly-root] .ff-welcome-device { display: none; } [data-firefly-root] textarea { min-height: 40px; height: 40px; } }\n@media (forced-colors: active) { [data-firefly-root] .ff-panel { background: Canvas; color: CanvasText; border-color: CanvasText; box-shadow: none; } [data-firefly-root] button { forced-color-adjust: auto; } }\n\n[data-firefly-root] .ff-studio-area { flex: none; margin: 0 14px; padding-top: 8px; }\n[data-firefly-root] [data-firefly-studio] { width: 100%; border: 1px solid #cfdbc5; border-radius: 12px; overflow: hidden; background: #e8ede1; }\n[data-firefly-root] [data-firefly-studio] svg { display: block; width: 100%; max-height: 194px; }\n[data-firefly-root] .ff-studio-caption { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 7px 3px 5px; color: #799077; font-size: 10px; }\n[data-firefly-root] .ff-studio-caption > span:last-child { font-size: 9px; color: #96a38c; }\n[data-firefly-root] .ff-worker-head { animation: ff-office-idle 6s steps(2, end) infinite; animation-delay: var(--ff-worker-delay); }\n[data-firefly-root] [data-mode='working'] .ff-worker-arms { animation: ff-office-type 1.3s steps(2, end) infinite; animation-delay: var(--ff-worker-delay); }\n[data-firefly-root] [data-mode='working'] .ff-screen-lines { animation: ff-office-screen 2.4s steps(2, end) infinite; animation-delay: var(--ff-worker-delay); }\n[data-firefly-root] [data-mode='waiting'] .ff-worker-head { animation: ff-office-wait 3s ease-in-out infinite; animation-delay: var(--ff-worker-delay); }\n[data-firefly-root] [data-mode='error'] .ff-screen-lines { fill: #d28e79; }\n@keyframes ff-office-idle { 0%, 85%, 100% { transform: translateY(0); } 90% { transform: translateY(1px); } }\n@keyframes ff-office-type { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }\n@keyframes ff-office-screen { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }\n@keyframes ff-office-wait { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }\n@media (max-height: 620px) {\n  [data-firefly-root] .ff-studio-area { margin: 0 10px; padding-top: 3px; }\n  [data-firefly-root] [data-firefly-studio] svg { max-height: 105px; }\n  [data-firefly-root] .ff-studio-caption { padding: 2px; font-size: 9px; }\n  [data-firefly-root] .ff-panel { height: calc(100dvh - 94px); max-height: calc(100dvh - 94px); }\n  [data-firefly-root] .ff-header { padding: 8px 12px; }\n  [data-firefly-root] .ff-scroll { padding: 8px 14px; }\n}\n@media (max-height: 450px) { [data-firefly-root] [data-firefly-studio] svg { max-height: 60px; } [data-firefly-root] .ff-studio-caption { display: none; } }\n";
		//#endregion
		//#region src/client/index.ts
		/** Existing DSH services; the assistant owns neither a transport nor a model provider. */
		const inject = [
			"slots",
			"sessions",
			"conversation",
			"workspaces",
			"locale",
			"connection"
		];
		/**
		* Register the independent assistant and its browser-local visibility controls.
		* @param ctx - Browser plugin context supplied by DSH.
		* @param config - Validated browser defaults.
		*/
		function apply(ctx, config) {
			let storage;
			try {
				storage = window.localStorage;
			} catch {
				storage = null;
			}
			const preferences = new PreferencesStore(storage, {
				enabled: config.enabled,
				right: config.defaultRight,
				bottom: config.defaultBottom
			});
			const controller = new AssistantController({
				sessions: ctx.sessions,
				workspaces: ctx.workspaces,
				conversation: ctx.conversation,
				connection: ctx.get("connection")
			}, storage, {
				historyRefreshMs: config.historyRefreshMs,
				publicationTimeoutMs: config.publicationTimeoutMs
			});
			ctx.effect(() => {
				controller.setActive(preferences.getSnapshot().values.enabled);
				return preferences.subscribe(() => {
					controller.setActive(preferences.getSnapshot().values.enabled);
				});
			}, "firefly: visibility lifetime");
			const viewStore = createViewStore();
			let active = true;
			let submitting = false;
			const preferenceFace = {
				hooks: { preferences },
				setEnabled: (enabled) => {
					preferences.update({ enabled });
				},
				setPosition: (position) => {
					preferences.update(position);
				},
				resetPosition: () => {
					preferences.resetPosition();
				}
			};
			ctx.effect(() => {
				const style = document.createElement("style");
				style.dataset.plugin = "dsh-firefly-assistant";
				style.textContent = firefly_default;
				document.head.appendChild(style);
				return () => {
					active = false;
					controller.dispose();
					style.remove();
				};
			}, "firefly: controller and styles");
			ctx.effect(() => {
				const zhDispose = ctx.locale.register("firefly-assistant", "zh", zh);
				const enDispose = ctx.locale.register("firefly-assistant", "en", en);
				return () => {
					enDispose();
					zhDispose();
				};
			}, "firefly: locale dictionaries");
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "firefly-assistant",
				order: 60,
				locale: "firefly-assistant",
				store: viewStore,
				inject: (actions) => ({
					...preferenceFace,
					hooks: {
						...preferenceFace.hooks,
						assistant: controller
					},
					startChat: async (workspaceId, draft) => {
						if (!active || submitting || !preferences.getSnapshot().values.enabled) return;
						submitting = true;
						try {
							const result = await controller.start(workspaceId, draft.text);
							if (active && result.ok) actions.accepted(draft.revision);
						} finally {
							submitting = false;
						}
					},
					sendMessage: async (draft) => {
						if (!active || submitting || !preferences.getSnapshot().values.enabled) return;
						submitting = true;
						try {
							const result = await controller.send(draft.text);
							if (active && result.ok) actions.accepted(draft.revision);
						} finally {
							submitting = false;
						}
					},
					reveal: () => {
						if (active) controller.reveal();
					},
					refresh: () => {
						if (active) controller.refresh();
					},
					loadOlder: () => {
						if (active) controller.loadOlder();
					},
					resetChat: () => {
						if (active && !submitting) controller.reset();
					},
					selectWorkspace: (id) => {
						if (active) controller.selectWorkspace(id);
					}
				})
			}, FireflyOverlay));
			ctx.slots.inject("settings.general.item", () => ctx.slots.register({
				name: "settings.general.item",
				id: "firefly-assistant",
				order: 65,
				locale: "firefly-assistant",
				inject: () => preferenceFace
			}, FireflySettings));
		}
		//#endregion
		exports.Config = Config;
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
