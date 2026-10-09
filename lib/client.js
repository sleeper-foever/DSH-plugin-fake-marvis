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
		//#region src/client/assets/device-body.png?inline
		var device_body_default = "data:image/png;base64,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";
		//#endregion
		//#region src/client/assets/device-left.png?inline
		var device_left_default = "data:image/png;base64,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";
		//#endregion
		//#region src/client/assets/device-right.png?inline
		var device_right_default = "data:image/png;base64,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";
		//#endregion
		//#region src/client/TransformDevice.tsx
		function WingFire({ ridge, vein, flame, paint }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
				className: "dshfa-wing-fire",
				"aria-hidden": "true",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						className: "dshfa-flame-tongue",
						d: flame,
						fill: paint
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						className: "dshfa-fire-rim",
						d: ridge,
						stroke: "#38EACA",
						strokeWidth: "5.8",
						strokeLinecap: "round",
						pathLength: "100"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						className: "dshfa-fire-stream",
						d: ridge,
						stroke: "#EDFFF0",
						strokeWidth: "3.6",
						strokeLinecap: "round",
						pathLength: "100"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						className: "dshfa-fire-stream dshfa-fire-stream-secondary",
						d: vein,
						stroke: "#8CFFF0",
						strokeWidth: "2.8",
						strokeLinecap: "round",
						pathLength: "100"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						className: "dshfa-fire-ember",
						d: ridge,
						stroke: "#FFDA83",
						strokeWidth: "4.2",
						strokeLinecap: "round",
						pathLength: "100"
					})
				]
			});
		}
		/** Reference-derived armor with independently hinged upper/lower light wings. See assets/NOTICE.md. */
		function TransformDevice({ size = 80, className, expanded = false }) {
			const id = (0, react.useId)();
			const upper = id + "-upper-light";
			const lower = id + "-lower-light";
			const edge = id + "-circuit-edge";
			const flame = id + "-wing-fire";
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				width: size,
				height: size,
				viewBox: "0 0 256 256",
				fill: "none",
				className,
				"data-wing-state": expanded ? "open" : "closed",
				"aria-hidden": "true",
				focusable: "false",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("defs", { children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("linearGradient", {
							id: upper,
							x1: "135",
							y1: "66",
							x2: "63",
							y2: "160",
							gradientUnits: "userSpaceOnUse",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									stopColor: "#CEFFF8",
									stopOpacity: ".83"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: ".24",
									stopColor: "#34DDD7",
									stopOpacity: ".6"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: ".57",
									stopColor: "#20B8B2",
									stopOpacity: ".27"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: "1",
									stopColor: "#AEC677",
									stopOpacity: ".13"
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("linearGradient", {
							id: lower,
							x1: "129",
							y1: "105",
							x2: "125",
							y2: "212",
							gradientUnits: "userSpaceOnUse",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									stopColor: "#A3FFF1",
									stopOpacity: ".85"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: ".35",
									stopColor: "#14CFC5",
									stopOpacity: ".55"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: ".68",
									stopColor: "#77CCA0",
									stopOpacity: ".27"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: "1",
									stopColor: "#F5B736",
									stopOpacity: ".77"
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("linearGradient", {
							id: edge,
							x1: "105",
							y1: "89",
							x2: "98",
							y2: "207",
							gradientUnits: "userSpaceOnUse",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", { stopColor: "#A8FFF1" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: ".55",
									stopColor: "#49E1CD"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: "1",
									stopColor: "#FFCF5D"
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("linearGradient", {
							id: flame,
							x1: "128",
							y1: "76",
							x2: "128",
							y2: "210",
							gradientUnits: "userSpaceOnUse",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									stopColor: "#C7FFF0",
									stopOpacity: ".12"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: ".45",
									stopColor: "#24E9CC",
									stopOpacity: ".66"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: ".8",
									stopColor: "#98FFCE",
									stopOpacity: ".85"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: "1",
									stopColor: "#FFE092",
									stopOpacity: ".58"
								})
							]
						})
					] }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
						className: "ff-device-wing",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
							"data-wing-side": "left",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
								className: "dshfa-light-wing dshfa-light-wing-upper",
								"data-wing-pair": "upper",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M104 83 83 79 57 93 30 116 7 143 36 139 51 129 40 148 65 139 94 112 114 102Z",
										fill: `url(#${upper})`,
										stroke: `url(#${edge})`,
										strokeWidth: "1"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M100 87 82 86 54 103 18 134 45 128 67 113 88 100",
										fill: "#A7FFF0",
										fillOpacity: ".09",
										stroke: "#B2FFF1",
										strokeWidth: ".65"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M86 86 77 95 68 96 44 117 31 127M103 94 92 100 82 102 65 117 54 134M66 96 67 104 51 117 42 117 26 132M83 110 75 122 59 134M54 104 45 103 31 114",
										stroke: "#95FFDB",
										strokeWidth: ".9",
										strokeOpacity: ".74"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M87 80 65 88 41 107 20 130",
										stroke: "#B0FFF6",
										strokeWidth: "2.1",
										strokeOpacity: ".6"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
										cx: "67",
										cy: "104",
										r: "1.3",
										fill: "#E4F3A8"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
										cx: "82",
										cy: "102",
										r: "1.2",
										fill: "#D3FFF1"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(WingFire, {
										paint: `url(#${flame})`,
										ridge: "M103 87 Q66 88 38 119 L10 141",
										vein: "M107 97 85 109 65 134 44 146",
										flame: "M104 85Q71 81 45 105L29 114 34 103 12 128 18 126 4 151 21 145 18 153 42 139 35 148 66 130 78 105 109 97Z"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("image", {
										href: device_left_default,
										x: "22",
										y: "6",
										width: "212",
										height: "202"
									})
								]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
								className: "dshfa-light-wing dshfa-light-wing-lower",
								"data-wing-pair": "lower",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M108 108 91 107 76 125 58 155 43 192 61 183 79 163 74 182 94 160 113 126Z",
										fill: `url(#${lower})`,
										stroke: `url(#${edge})`,
										strokeWidth: "1"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M101 115 89 118 73 142 52 179 67 168 89 133Z",
										fill: "#BFFFF0",
										fillOpacity: ".15"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M101 116 88 127 85 141 71 157 60 176M84 127 74 137 70 148 61 157M98 131 91 149 81 163",
										stroke: "#B6FFD2",
										strokeWidth: ".9",
										strokeOpacity: ".76"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M52 174 44 190 60 181 70 168",
										stroke: "#FFD361",
										strokeWidth: "1.3"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(WingFire, {
										paint: `url(#${flame})`,
										ridge: "M103 112 Q80 134 66 160 L46 190",
										vein: "M105 122 93 144 82 158 76 179",
										flame: "M103 111Q79 126 67 154L56 166 57 154 44 180 34 202 52 192 48 205 72 178 68 193 95 157 108 126Z"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M97 107 106 110 110 116 101 124 96 116Z",
										fill: "#D0D5BD",
										stroke: "#8A9A89",
										strokeWidth: ".7"
									})
								]
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
							"data-wing-side": "right",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
								className: "dshfa-light-wing dshfa-light-wing-upper",
								"data-wing-pair": "upper",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M150 74 169 70 193 78 219 94 248 121 217 115 202 105 216 127 188 116 156 92Z",
										fill: `url(#${upper})`,
										stroke: `url(#${edge})`,
										strokeWidth: "1"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M163 79 177 79 199 88 234 112 208 105 189 95 169 87",
										fill: "#A7FFF0",
										fillOpacity: ".13",
										stroke: "#B2FFF1",
										strokeWidth: ".65"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M174 77 184 85 195 86 222 103M156 85 168 89 181 91 196 106 206 115M182 95 185 103 199 112M201 86 209 94 218 95",
										stroke: "#95FFDB",
										strokeWidth: ".85",
										strokeOpacity: ".74"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M164 71 190 75 221 93 242 114",
										stroke: "#B0FFF6",
										strokeWidth: "2.1",
										strokeOpacity: ".58"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
										cx: "195",
										cy: "86",
										r: "1.4",
										fill: "#E4F3A8"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
										cx: "185",
										cy: "103",
										r: "1.1",
										fill: "#D3FFF1"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(WingFire, {
										paint: `url(#${flame})`,
										ridge: "M158 78 Q191 72 218 98 L244 118",
										vein: "M156 86 178 99 197 109 213 125",
										flame: "M157 77Q195 67 224 94L236 98 231 88 249 107 246 108 255 129 235 124 246 133 222 121 229 134 190 111 157 91Z"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("image", {
										href: device_right_default,
										x: "22",
										y: "6",
										width: "212",
										height: "202"
									})
								]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
								className: "dshfa-light-wing dshfa-light-wing-lower",
								"data-wing-pair": "lower",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M149 113 163 113 180 134 198 162 210 191 192 181 177 160 182 180 163 159 145 132Z",
										fill: `url(#${lower})`,
										stroke: `url(#${edge})`,
										strokeWidth: "1"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M155 120 169 131 188 161 202 181 191 172 167 140Z",
										fill: "#BFFFF0",
										fillOpacity: ".14"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M157 123 166 134 168 146 182 161 194 179M173 135 182 144 185 156M155 140 164 156 173 165",
										stroke: "#B6FFD2",
										strokeWidth: ".9",
										strokeOpacity: ".76"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M201 173 209 189 194 180 183 164",
										stroke: "#FFD361",
										strokeWidth: "1.3"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(WingFire, {
										paint: `url(#${flame})`,
										ridge: "M154 117 Q180 139 190 160 L207 188",
										vein: "M151 127 166 147 175 163 180 178",
										flame: "M153 116Q179 128 195 157L207 169 204 153 221 184 230 203 211 192 217 205 193 181 200 196 171 160 147 130Z"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M149 111 159 114 164 122 155 128 149 122Z",
										fill: "#D6DAC5",
										stroke: "#91A097",
										strokeWidth: ".7"
									})
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("g", {
						className: "ff-device-core",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("image", {
							href: device_body_default,
							x: "22",
							y: "6",
							width: "212",
							height: "202"
						})
					})
				]
			});
		}
		//#endregion
		//#region src/client/PixelFirefly.tsx
		/** Pixel-grid artwork: silver hair, two-tone eyes, leaf ornament, black/gold jacket and teal dress. */
		function PixelFirefly({ pose = "typing" }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("g", {
				"data-pixel-character": "firefly",
				"data-pose": pose,
				shapeRendering: "crispEdges",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
					className: "ff-worker-body",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
							"data-pixel-detail": "long-hair",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M16 6h29v3h7v6h4v10h3v27h-3v8h-4v8h-8v-6H18v5H9v-5H5V50h4V23h3V12h4Z",
									fill: "#7f9691"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M16 10h31v5h6v15h3v23h-4v9h-6v-7H17v7h-7V50H8v-9h4V22h4Z",
									fill: "#d4ddd4"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M13 38h7v18h-3v7h-6V52H8v-6h5M46 36h7v13h3v9h-5v7h-6V50h1",
									fill: "#b5d7cd"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M12 51h6v7h-2v5h-5v-5H8v-5h4M48 52h8v6h-5v7h-6v-5h3",
									fill: "#76b8b2"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M13 26h3v20h-3M48 26h3v20h-3",
									fill: "#eef0e4"
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
							"data-pixel-detail": "boots",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M23 74h8v15h-9V78h1M36 74h8v15h-9V78h1",
									fill: "#273e48"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M24 76h6v9h-7v-6h1M37 76h6v9h-7v-6h1",
									fill: "#27777f"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M21 82h11v4H21M34 82h11v4H34",
									fill: "#77c4b4"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M23 85h7v4h-2v2h-3v-2h-2M36 85h7v4h-2v2h-3v-2h-2",
									fill: "#dfbc72"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M23 89h8v5H20v-3h3M36 89h8v2h3v3H35v-5",
									fill: "#fcf7e9"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M20 93h11v2H20M35 93h12v2H35",
									fill: "#687d7b"
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
							"data-pixel-detail": "teal-dress",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M21 46h22v5h4v12h3v7h4v9h-9v-3H23v3H12v-8h4V58h5Z",
									fill: "#343d43"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M21 48h5v5h-5v4h-4v-2h-2v-3h6M40 48h5v5h6v3h-4v-2h-7",
									fill: "#d6b86d"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M28 44h10v7H28",
									fill: "#e6c4b0"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M25 47h5v4h4v-4h7v10h-4v5H26v-7h-4v-5h3",
									fill: "#369ea0"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M28 47h3v6h-5v-3h2M36 47h3v5h-3",
									fill: "#8dd5c4"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M26 60h13v5h3v6h4v8H18v-6h3v-6h3v-6Z",
									fill: "#63bfb0"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M28 61h6v7h-2v8h-5v4h-9v-4h4v-5h3v-6h3M37 64h3v6h3v5h3v5h-8v-8h-1",
									fill: "#e1efc7"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M25 64h5v8h-3v5h-7v-4h3v-5h2M36 64h3v6h3v6h-4v-3h-2",
									fill: "#329eaa"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M24 69h3v4h-3M38 69h3v4h-3",
									fill: "#e0d398"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M17 77h10v3h10v-2h10v4H17Z",
									fill: "#e8edc6"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M18 81h28v2H18",
									fill: "#bcceaf"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M15 62h3v8h-3v8h-5v-3h2v-7h3M46 63h3v8h4v7h-5v-5h-2",
									fill: "#d0b878"
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
							className: "ff-worker-arms",
							"data-pixel-detail": "sleeves",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M18 50h7v6h-4v10h-8v-9h2v-5h3M41 50h7v4h4v12h-8v-9h-3Z",
									fill: "#f1eee4"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M14 57h3v7h-3M48 55h3v8h-3",
									fill: "#b7c7c2"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M13 63h8v3h-8M44 63h8v3h-8",
									fill: "#343f48"
								}),
								pose === "typing" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M19 63h7v-3h8v4h-7v4h-8M48 62h7v-4h6v5h-4v5h-9Z",
									fill: "#f0d2c1"
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M25 62h8v2h-8M55 58h6v2h-6",
									fill: "#fff0df"
								})] }),
								pose === "reading" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M18 63h8v6h-8M43 62h7v7h-7",
										fill: "#f0d2c1"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M25 58h18v15H25Z",
										fill: "#667f76"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M27 59h7v12h-7M35 59h6v12h-6",
										fill: "#f7e8c4"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M34 59h1v12h-1M28 63h5v1h-5M36 63h4v1h-4M28 66h5v1h-5",
										fill: "#c3b58d"
									})
								] }),
								pose === "thinking" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M18 63h8v5h-8M46 60h6V47h-3v-5h-6v6h3Z",
									fill: "#f0d2c1"
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M44 42h4v3h-4",
									fill: "#fff0df"
								})] })
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
							"data-pixel-detail": "gold-bow",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M30 52h6v4h-6M22 53h7v3h3v3h-7v-2h-3M37 53h7v5h-3v2h-7v-4h3",
									fill: "#e7bc66"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M25 59h6v4h-3v5h-4v-3h1M35 59h5v5h3v4h-5v-4h-3",
									fill: "#d69f43"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M24 54h4v1h-4M37 54h5v2h-5M31 52h3v2h-3",
									fill: "#fff0b0"
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
							className: "ff-worker-head",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M18 3h23v2h7v4h5v8h3v17h-3v9h-7v5H20v-4h-7v-8h-3V19h3V9h5Z",
									fill: "#899b99"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M18 6h24v2h7v6h3v19h-4v10H20v-3h-5v-8h-2V20h3V11h2Z",
									fill: "#ebe9df"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M21 8h18v2h-8v3H19v6h-3v-7h5M42 12h6v7h3v11h-3V20h-6Z",
									fill: "#fbf7eb"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M18 23h29v4h4v11h-3v6h-6v3H25v-3h-6v-7h-3V27h2Z",
									fill: "#f3d7c8"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M20 37h6v3h-6M41 37h6v3h-6",
									fill: "#eeb7b2"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
									"data-pixel-detail": "eyes",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
											d: "M20 28h9v3h-1v8h-6v-2h-2M37 28h10v9h-2v2h-7V30h-1Z",
											fill: "#55495f"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
											transform: `translate(${pose === "typing" ? 1 : 0} 0)`,
											children: [
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
													d: "M22 31h5v6h-5M39 31h6v6h-6",
													fill: "#79bed1"
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
													d: "M22 35h5v3h-5M39 35h6v3h-6",
													fill: "#ba9bd4"
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
													d: "M24 31h2v4h-2M41 31h2v4h-2",
													fill: "#577bae"
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
													d: "M22 31h2v2h-2M39 31h2v2h-2M25 36h1v1h-1M43 36h1v1h-1",
													fill: "#fffcf1"
												})
											]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
											d: "M31 42h5v1h-5",
											fill: "#b78985"
										})
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
									"data-pixel-detail": "headband",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
											d: "M19 13h25v2h4v7H16v-5h3Z",
											fill: "#d4ba81"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
											d: "M20 14h23v2h4v5H17v-3h3Z",
											fill: "#413e45"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
											d: "M27 14h7v2h-2v2h-1v1h2v2h-6v-2h2v-2h-2Z",
											fill: "#e8cf8f"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
											d: "M29 15h3v1h-1v2h-1v2h1v1h-2v-2h1v-2h-1Z",
											fill: "#c9f2df"
										})
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
									"data-pixel-detail": "bangs",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
											d: "M17 21h10v5h-3v7h-3v6h-4v-6h-2V25h2M27 20h11v8h-3v8h-3v3h-3v-8h-2M39 21h8v4h4v10h-3v5h-4v-6h-3v-6h-2",
											fill: "#e7e7de"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
											d: "M18 22h3v8h-2v4h-2M28 21h3v9h-2M41 22h3v5h2v5h-2v-4h-3",
											fill: "#fff9ea"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
											d: "M24 24h2v8h-2v5h-3v-4h2v-5h1M34 23h3v6h-2v8h-3v-4h2M47 25h3v10h-3v4h-2v-6h2",
											fill: "#bcc8c2"
										})
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
									"data-pixel-detail": "leaf-ornament",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
											d: "M52 18h4v-7h3V6h3v8h-2v6h-5v4h-3Z",
											fill: "#d7e6a9"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
											d: "M54 22h5v-3h5v-5h2v9h-5v4h-7Z",
											fill: "#bfda99"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
											d: "M52 25h4v5h-4M55 29h4v15h-3V33h-1M51 29h3v12h-3",
											fill: "#344965"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
											d: "M52 25h3v3h-3",
											fill: "#e7ce8b"
										})
									]
								})
							]
						})
					]
				})
			});
		}
		//#endregion
		//#region src/client/PixelCompanions.tsx
		/** Pixel reinterpretations of the two character references, with distinct silhouettes and costumes. */
		function PixelCompanion({ kind }) {
			if (kind === "silver-wolf") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("g", {
				"data-pixel-character": "silver-wolf",
				"data-pose": "typing",
				shapeRendering: "crispEdges",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
					className: "ff-worker-body",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
							"data-pixel-detail": "asymmetric-boots",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M23 69h8v16h-8M36 69h8v16h-8",
									fill: "#ead1c6"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M37 78h8v8h-8",
									fill: "#a390a9"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M38 79h2v2h-2M42 79h2v2h-2M40 81h2v2h-2M38 83h2v2h-2M42 83h2v2h-2",
									fill: "#4d445f"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M21 83h11v12H18v-4h3M35 83h11v8h3v4H35",
									fill: "#35394f"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M22 83h8v4h-5v4h-4M37 83h8v6h-5v3h-3",
									fill: "#747cdf"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M20 95h12v2H18v-2M35 95h14v2H35",
									fill: "#9dadd2"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M17 68h3v18h-4V73h1",
									fill: "#4e526a"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M16 69h4v4h-4",
									fill: "#a99be7"
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
							"data-pixel-detail": "purple-tech-jacket",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M23 43h20v3h7v8h3v9H18V53h-4v-7h9Z",
									fill: "#383649"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M24 45h6v11h-9v-5h-4v-4h7M38 44h8v4h4v6h-8v4h-4",
									fill: "#8a83d0"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M28 46h12v10H27v-7h1",
									fill: "#f0eff0"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M29 50h3v3h2v-3h4v4h-9",
									fill: "#a5b9e2"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M26 57h17v5H26",
									fill: "#edcfc3"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M21 63h25v9h3v5H35v-5h-4v5H20v-9h1",
									fill: "#3f3c50"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M20 62h27v4H20",
									fill: "#b8b4c0"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M29 62h6v5h-6",
									fill: "#e6d5a0"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M31 63h2v2h-2",
									fill: "#6c6289"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M39 63h8v5h4v7h-5v-5h-7",
									fill: "#bda1df"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M19 45h7v3h-9v3h-3v-6h5M41 43h8v3h4v4h-5v-3h-7",
									fill: "#dbe2e4"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M41 46h3v9h-3M22 49h2v7h-2",
									fill: "#d4c4ef"
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
							className: "ff-worker-arms",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M17 50h7v9h8v5H19v-3h-4V54h2M43 50h7v10h6v5H44v-5h-1",
									fill: "#444157"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M25 59h8v5h-8M52 59h8v5h-8",
									fill: "#e6c8bc"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M29 60h5v5h-5M57 60h5v5h-5",
									fill: "#454a61"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M18 54h5v2h-5M45 56h5v2h-5",
									fill: "#a18dd5"
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
							className: "ff-worker-head",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
									"data-pixel-detail": "rabbit-ears",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
											d: "M26 11 19-6h5l9 16M35 9 47-3h4L42 13",
											fill: "#454e81"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
											d: "M24-2 29 7h-3L22-2M44 3h3l-7 7h-2",
											fill: "#8e8bd3"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
											d: "M27 11h14v3H27",
											fill: "#e0e2e6"
										})
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M20 11h22v3h7v5h4v17h-5v8h-6v4H23v-4h-6v-9h-3V22h3v-7h3Z",
									fill: "#717383"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M22 14h20v3h6v6h3v12h-5v6H21v-6h-4V24h3v-7h2Z",
									fill: "#b9bcc9"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M22 24h25v4h3v9h-5v7H25v-4h-5V29h2Z",
									fill: "#efcfbf"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M23 29h7v8h-5v-5h-2M38 29h8v8h-6v-5h-2",
									fill: "#53495e"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M25 31h4v5h-4M40 31h4v5h-4",
									fill: "#bd99ca"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M25 31h2v2h-2M40 31h2v2h-2",
									fill: "#f9f1ed"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M31 42h5v1h-5",
									fill: "#b88983"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
									"data-pixel-detail": "goggles",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
											d: "M20 14h28v7H19v-4h1Z",
											fill: "#4f5286"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
											d: "M22 15h11v4H21v-3h1",
											fill: "#80bded"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
											d: "M35 15h11v4H35",
											fill: "#b699ee"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
											d: "M23 15h8v1h-8M36 15h8v1h-8",
											fill: "#cce7ff"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
											d: "M32 16h3v2h-3",
											fill: "#e9dcef"
										})
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
									"data-pixel-detail": "silver-bob",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
											d: "M19 22h9v3h-4v8h-3v8h-4V31h-2v-6h4M27 21h12v7h-3v7h-3v4h-3v-8h-3M41 21h7v5h3v9h-4v6h-3v-8h-3Z",
											fill: "#bfc1ce"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
											d: "M19 24h3v8h-3M29 23h3v6h-3M43 23h3v7h-3",
											fill: "#e5e4ee"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
											d: "M35 24h3v7h-3v5h-3v-6h3M48 28h2v8h-3v4h-2v-7h3",
											fill: "#989bad"
										})
									]
								})
							]
						})
					]
				})
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("g", {
				"data-pixel-character": "stelle",
				"data-pose": "sketching",
				shapeRendering: "crispEdges",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
					className: "ff-worker-body",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
							"data-pixel-detail": "gray-long-hair",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M18 9h26v5h7v14h4v26h-4v13h-8V52H20v13h-8V54H8V39h5V20h5Z",
									fill: "#69666a"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M20 13h24v8h5v29h-4v11h-5V42H23v17h-8v-9h-3v-9h4V23h4Z",
									fill: "#959191"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M16 37h4v20h-4M45 32h3v18h-3v9h-3V46h3",
									fill: "#b6aeaa"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M10 49h4v8h6v6h-8v-5H8v-5h2M45 51h7v7h-4v7h-6v-7h3",
									fill: "#807d82"
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
							"data-pixel-detail": "trailblazer-coat",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M23 44h20v5h7v13h3v16h-7v-8h-4V54H25v17h-6v13h-9v-5h3V63h4V49h6Z",
									fill: "#343a43"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M20 49h7v18h-5v11h-4V61h2M39 47h7v11h4v13h-5v-9h-4v-9h-2",
									fill: "#4e5259"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M20 47h5v14h-3v10h-4V59h2M39 46h5v8h3v11h-4V54h-4",
									fill: "#e0b957"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M25 48h14v8h-2v8h3v7H24V60h2Z",
									fill: "#e9e4dc"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M28 47h9v3h-4v5h-4v-3h-2",
									fill: "#f7f4e9"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M24 60h4v4h8v3H25M34 53h3v8h-3",
									fill: "#bfc3c6"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M20 71h25v5h4v5H18v-6h2",
									fill: "#42444d"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M22 71h21v2H22M35 72h7v4h-7",
									fill: "#89817a"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M16 70h3v11h-7v4H8v-4h6v-7h2M45 67h4v8h5v6h-6v-5h-3",
									fill: "#c7ac68"
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
							"data-pixel-detail": "trailblazer-boots",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M23 81h8v11h-8M36 81h8v11h-8",
									fill: "#ebcaba"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M21 89h11v6H18v-3h3M35 89h10v3h4v3H35",
									fill: "#3c424a"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M23 89h6v2h-6M37 89h6v2h-6",
									fill: "#bda879"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M18 95h14v2H18M35 95h14v2H35",
									fill: "#777979"
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
							className: "ff-worker-arms",
							"data-pixel-detail": "notepad",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M18 49h7v12h5v6H18V55h-3M43 48h8v12h-6V54h-2",
									fill: "#4d5058"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M20 58h5v6h-5M46 54h5v6h-5",
									fill: "#e6c5b5"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M25 61h7v5h-7M45 58h7v5h-7",
									fill: "#363d49"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M31 55h18v19H29V57h2",
									fill: "#777b83"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M32 57h14v15H32Z",
									fill: "#eee5cb"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M34 61h10v2H34M34 66h7v2h-7",
									fill: "#b7b49e"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M47 50h3v9h-3v5h-2V53h2Z",
									fill: "#d4b36b"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M45 61h2v3h-2",
									fill: "#4e5663"
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
							className: "ff-worker-head",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M20 7h22v4h7v7h4v19h-5v7h-6v4H24v-5h-6v-9h-4V20h3v-9h3Z",
									fill: "#747177"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M23 11h18v3h7v9h3v11h-5v8H23v-5h-6V23h3v-8h3Z",
									fill: "#a8a2a0"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M25 12h12v3H25M20 19h3v6h-3",
									fill: "#d3cbc1"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M23 23h23v4h4v10h-5v7H25v-4h-6V29h4Z",
									fill: "#f0d1be"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
									"data-pixel-detail": "gold-eyes",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
											d: "M23 29h8v8h-6v-5h-2M38 29h9v8h-6v-5h-3",
											fill: "#605346"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
											d: "M25 31h5v5h-5M41 31h5v5h-5",
											fill: "#d4b657"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
											d: "M27 31h2v4h-2M43 31h2v4h-2",
											fill: "#937e40"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
											d: "M25 31h2v2h-2M41 31h2v2h-2",
											fill: "#fff2c7"
										})
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M31 42h5v1h-5",
									fill: "#b38779"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M20 22h9v5h-3v7h-3v5h-4V28h-2v-3h3M28 21h12v7h-3v7h-4v3h-3v-9h-2M42 22h6v5h3v8h-4v6h-4V30h-1",
									fill: "#a8a29f"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M21 23h3v8h-3M30 23h3v5h-3M43 24h3v7h-3",
									fill: "#d4cbc0"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M36 24h3v5h-2v7h-4v-4h3M48 27h2v9h-3v4h-2v-8h3",
									fill: "#8b8990"
								})
							]
						})
					]
				})
			});
		}
		//#endregion
		//#region src/client/StarRailScreen.tsx
		/** Local decorative miniature; no game connection, credentials or launch action. */
		function StarRailScreen() {
			const id = (0, react.useId)();
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
				"data-monitor-screen": "star-rail-login",
				x: "56",
				y: "13",
				width: "37",
				height: "23",
				viewBox: "0 0 160 100",
				"aria-hidden": "true",
				shapeRendering: "geometricPrecision",
				overflow: "hidden",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("defs", { children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("linearGradient", {
							id: id + "-space",
							x2: "1",
							y2: "1",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", { stopColor: "#091328" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: ".55",
									stopColor: "#293d72"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: "1",
									stopColor: "#798bbe"
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("radialGradient", {
							id: id + "-glow",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
								stopColor: "#dddffa",
								stopOpacity: ".85"
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
								offset: "1",
								stopColor: "#8b9bd3",
								stopOpacity: "0"
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("linearGradient", {
							id: id + "-scan",
							x1: "0",
							y1: "0",
							x2: "0",
							y2: "1",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									stopColor: "#8bdfff",
									stopOpacity: "0"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: ".5",
									stopColor: "#baf7ff",
									stopOpacity: ".2"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: "1",
									stopColor: "#8bdfff",
									stopOpacity: "0"
								})
							]
						})
					] }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
						width: "160",
						height: "100",
						fill: `url(#${id}-space)`
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ellipse", {
						className: "ff-screen-nebula",
						cx: "132",
						cy: "62",
						rx: "54",
						ry: "40",
						fill: `url(#${id}-glow)`
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
						className: "ff-screen-stars",
						fill: "#edf3ff",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
								cx: "14",
								cy: "14",
								r: ".8"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
								cx: "32",
								cy: "26",
								r: "1"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
								cx: "73",
								cy: "11",
								r: ".8"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
								cx: "139",
								cy: "16",
								r: "1.2"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
								cx: "151",
								cy: "47",
								r: ".8"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
								cx: "101",
								cy: "16",
								r: ".6"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
								cx: "23",
								cy: "63",
								r: ".8"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
								cx: "48",
								cy: "8",
								r: ".6"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
								d: "M119 15v8m-4-4h8",
								stroke: "#d9e5ff",
								strokeWidth: ".8"
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M-8 91Q80 64 169 66M-8 96Q80 70 169 69",
						stroke: "#dce6ff",
						strokeWidth: "1.2",
						opacity: ".55"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("g", {
						transform: "translate(11 68) rotate(-8)",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
							className: "ff-screen-train",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M0 0h83l13 6-13 6H0Z",
									fill: "#131d34",
									stroke: "#929ebc",
									strokeWidth: ".7"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M5 2h12v5H5M22 2h12v5H22M39 2h12v5H39M56 2h12v5H56M73 2h9v5h-9",
									fill: "#eadcb3"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M1 11h82",
									stroke: "#bc9f71"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M91 6h8",
									stroke: "#eff4ff",
									strokeWidth: "2"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("text", {
						x: "78",
						y: "35",
						textAnchor: "middle",
						fill: "#fff",
						fontFamily: "'Noto Sans CJK SC','Microsoft YaHei',sans-serif",
						fontSize: "13",
						fontWeight: "700",
						children: "崩坏"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M30 39h33m28 0h32",
						stroke: "#e5e9ff",
						strokeWidth: ".8"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("text", {
						x: "80",
						y: "55",
						textAnchor: "middle",
						fill: "#fff",
						fontFamily: "'Noto Sans CJK SC','Microsoft YaHei',sans-serif",
						fontSize: "20",
						fontWeight: "800",
						letterSpacing: "1",
						children: "星穹铁道"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
						className: "ff-screen-scan",
						x: "0",
						y: "-12",
						width: "160",
						height: "12",
						fill: `url(#${id}-scan)`
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("g", {
						className: "ff-screen-lines",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("text", {
							x: "80",
							y: "93",
							textAnchor: "middle",
							fill: "#f7f5ed",
							fontFamily: "sans-serif",
							fontSize: "8",
							children: "点击进入"
						})
					})
				]
			});
		}
		//#endregion
		//#region src/client/StudioScene.tsx
		function Fan({ y }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
				transform: `translate(87 ${y})`,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
						r: "6",
						fill: "#090d18",
						stroke: "var(--ff-workstation-accent)",
						strokeWidth: "1"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("g", {
						className: "ff-pc-rotor",
						fill: "var(--ff-workstation-accent)",
						opacity: ".6",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M0-1 0-5 3-3 2 0ZM1 0 5 0 3 3 0 2ZM0 1 0 5-3 3-2 0ZM-1 0-5 0-3-3 0-2Z" })
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
						r: "1.2",
						fill: "#cfe9f5"
					})
				]
			});
		}
		function Desk({ x, y, character, index }) {
			const accent = character === "silver-wolf" ? "#aa83ff" : character === "firefly" ? "#91edb1" : "#6baeff";
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
				transform: `translate(${x} ${y})`,
				"data-worker": index,
				style: {
					"--ff-worker-delay": index * .26 + "s",
					"--ff-workstation-accent": accent
				},
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ellipse", {
						className: "ff-desk-aura",
						cx: "47",
						cy: "87",
						rx: "46",
						ry: "10",
						fill: accent,
						opacity: ".07"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M17 48h8l-3 34H12v-4h5M81 48h7v33h8v4H80V51",
						fill: "#263147"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M11 40h83l5 4v8H7v-8Z",
						fill: "#172035",
						stroke: "#3c4862",
						strokeWidth: "1"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						className: "ff-desk-led",
						d: "M8 48h87",
						stroke: accent,
						strokeWidth: "1.5"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M13 42h70v3H13",
						fill: "#283149"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M77 54h21v30H77Z",
						fill: "#0b101e",
						stroke: "#34425e"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Fan, { y: 62 }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Fan, { y: 76 }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M54 9h44v30H54z",
						fill: "#101627",
						stroke: "#485779"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(StarRailScreen, {}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M72 39h6v4h-6M65 43h20v2H65",
						fill: "#54607c"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M54 44h23v3H54",
						fill: "#13172b"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						className: "ff-keyboard-led",
						d: "M55 45h5m2 0h5m2 0h6",
						stroke: accent,
						strokeWidth: "1"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M90 32h6v8h-6M96 33h2v4h-2",
						fill: "#283550"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M91 33h4",
						stroke: accent
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M15 35h14v4H15",
						fill: "#483955"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M17 32h14v3H17",
						fill: "#74678b"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M22 50h17l5 6v18H20V57Z",
						fill: "#1d283e",
						stroke: "#415373"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M24 52h11v3H24M23 66h14",
						stroke: accent,
						opacity: ".7"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M23 74h22v5H23M32 79h5v8h-5M22 87h27",
						stroke: "#62708b",
						strokeWidth: "2"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("g", {
						transform: "translate(4 2) scale(.88)",
						children: character === "firefly" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PixelFirefly, { pose: "reading" }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PixelCompanion, { kind: character })
					})
				]
			});
		}
		/** Ambient gaming-room illustration, still driven by one assistant's actual activity state. */
		function StudioScene({ mode, label }) {
			const id = (0, react.useId)();
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				"data-firefly-studio": true,
				"data-scene-theme": "neon-gaming",
				"data-mode": mode,
				role: "img",
				"aria-label": label,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 440 204",
					fill: "none",
					"aria-hidden": "true",
					shapeRendering: "crispEdges",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("defs", { children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("linearGradient", {
								id: id + "-wall",
								x2: "1",
								y2: "1",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", { stopColor: "#0b101e" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
										offset: ".5",
										stopColor: "#211c39"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
										offset: "1",
										stopColor: "#121b2e"
									})
								]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("linearGradient", {
								id: id + "-window",
								x2: "0",
								y2: "1",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", { stopColor: "#111830" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: "1",
									stopColor: "#293458"
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("linearGradient", {
								id: id + "-rgb",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", { stopColor: "#8058ca" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
										offset: ".4",
										stopColor: "#638bff"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
										offset: ".8",
										stopColor: "#6de8c3"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
										offset: "1",
										stopColor: "#9defad"
									})
								]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("radialGradient", {
								id: id + "-pool",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									stopColor: "#6446a3",
									stopOpacity: ".35"
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: "1",
									stopColor: "#1a152b",
									stopOpacity: "0"
								})]
							})
						] }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							"data-room-glass": "base",
							d: "M0 0h440v204H0Z",
							fill: "#0a1020",
							fillOpacity: ".16"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							"data-room-glass": "wall",
							d: "M0 0h440v103H0Z",
							fill: `url(#${id}-wall)`,
							fillOpacity: ".52"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							"data-room-glass": "floor",
							d: "M0 103h440v101H0Z",
							fill: "#101628",
							fillOpacity: ".4"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ellipse", {
							cx: "228",
							cy: "150",
							rx: "220",
							ry: "65",
							fill: `url(#${id}-pool)`
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M0 128h440M0 160h440M0 196h440M55 103 9 204M130 103 103 204M210 103 206 204M295 103 322 204M378 103 430 204",
							stroke: "#26314c"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							className: "ff-room-traces",
							d: "M0 102h84l16 16h42M440 101H331l-16 16h-43M15 193h79l17-17h31M428 191h-71l-13-13h-53",
							stroke: `url(#${id}-rgb)`,
							strokeWidth: "1",
							opacity: ".7"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M9 12h135l11-7h121l13 7h143M11 12v73M429 12v67",
							stroke: "#3b3557",
							strokeWidth: "2"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							className: "ff-room-pulse",
							d: "M13 14h105M309 14h112",
							stroke: `url(#${id}-rgb)`,
							strokeWidth: "2"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M30 25h121v52H30Z",
							fill: "#090f21",
							stroke: "#53618d"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M34 29h113v44H34Z",
							fill: `url(#${id}-window)`
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M36 70V58h10V48h12v22M61 70V43h14v27M80 70V54h13v16M99 70V39h13v31M116 70V48h13v22M134 70V55h11v15",
							fill: "#141d36"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							className: "ff-city-lights",
							d: "M49 53h3m-3 5h3M65 47h6m-6 5h6m-6 5h6M103 44h5m-5 6h5m-5 6h5M120 53h5m-5 5h5M137 61h4",
							stroke: "#7f8ddb",
							strokeWidth: "1"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M88 29v44M34 73h113",
							stroke: "#3d4e75",
							strokeWidth: "2"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							className: "ff-city-traffic",
							d: "M38 66h17M114 61h15",
							stroke: "#67bde1",
							strokeWidth: "1"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M173 20h95v27h-95Z",
							fill: "#10172b",
							stroke: "#41385f"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							className: "ff-room-pulse",
							d: "M182 40h77",
							stroke: "#9cedae",
							opacity: ".6"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("text", {
							x: "220",
							y: "35",
							textAnchor: "middle",
							fontFamily: "monospace",
							fontSize: "10",
							letterSpacing: "2",
							fill: "#aedec9",
							children: "FIREFLY"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M304 27h36v29h-36Z",
							fill: "#281a34",
							stroke: "#755d87"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M313 34h17l-9 14-8-14Z",
							stroke: "#a488d8"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M321 33v15",
							stroke: "#c3aaeb"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M351 27h34v29h-34Z",
							fill: "#311926",
							stroke: "#6b3b54"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M357 46 364 33l5 13 10-13",
							stroke: "#ab6578",
							strokeWidth: "2"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M301 65h86v5h-86",
							fill: "#252942"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M305 66h76",
							stroke: "#7562b2"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M313 60v-9h6v9M325 60V49h8v11M340 60v-7h5v7",
							fill: "#4f4971"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M10 111h13v52H10Z",
							fill: "#14192a",
							stroke: "#344258"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							className: "ff-server-status",
							d: "M13 117h7m-7 8h7m-7 8h7m-7 8h7m-7 8h7",
							stroke: "#7bd9ab",
							strokeWidth: "2"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M410 98h22v66h-22Z",
							fill: "#1c1525",
							stroke: "#4b2840"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M414 104h14v16h-14M414 126h14v16h-14M414 148h14v10h-14",
							fill: "#361b2d"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							className: "ff-server-status",
							d: "M417 109h8m-8 6h5M417 132h8m-8 5h5M417 152h8",
							stroke: "#9e4769"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Desk, {
							x: 30,
							y: 86,
							character: "silver-wolf",
							index: 1
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Desk, {
							x: 164,
							y: 62,
							character: "firefly",
							index: 2
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Desk, {
							x: 289,
							y: 89,
							character: "stelle",
							index: 3
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M151 163h17v23h-17Z",
							fill: "#192538",
							stroke: "#365569"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							className: "ff-room-pulse",
							d: "M156 168v12m6-12v12",
							stroke: "#70dbb0"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M254 181h37v7h-37",
							fill: "#172039"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M260 181h25",
							stroke: "#655ca1"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
							className: "ff-room-motes",
							fill: "#83cdb7",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
									x: "26",
									y: "52",
									width: "1",
									height: "1"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
									x: "163",
									y: "89",
									width: "1",
									height: "1"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
									x: "279",
									y: "46",
									width: "1",
									height: "1"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
									x: "390",
									y: "78",
									width: "1",
									height: "1"
								})
							]
						})
					]
				})
			});
		}
		//#endregion
		//#region src/client/CrystalFacets.tsx
		const xs = [
			0,
			65,
			143,
			228,
			318,
			393,
			464
		];
		const ys = [
			0,
			64,
			145,
			236,
			338,
			447,
			551,
			642,
			720
		];
		const mesh = ys.map((y, row) => xs.map((x, column) => ({
			x: column === 0 || column === xs.length - 1 ? x : x + ((row + column * 2) % 3 - 1) * 13,
			y: row === 0 || row === ys.length - 1 ? y : y + ((row * 3 + column) % 4 - 1.5) * 8
		})));
		const facets = mesh.slice(0, -1).flatMap((row, r) => row.slice(0, -1).flatMap((a, c) => {
			const b = row[c + 1];
			const d = mesh[r + 1][c + 1];
			const e = mesh[r + 1][c];
			return [[
				a,
				b,
				(r + c) % 2 ? e : d
			], [
				(r + c) % 2 ? b : a,
				d,
				e
			]];
		}));
		/** Decorative reflections are geometry, not a content filter; controls and text remain above them. */
		function CrystalFacets() {
			const id = (0, react.useId)();
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
				className: "dshfa-crystal-facets",
				"data-crystal-facets": true,
				viewBox: "0 0 464 720",
				preserveAspectRatio: "none",
				"aria-hidden": "true",
				focusable: "false",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("defs", { children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("linearGradient", {
							id: id + "-silver",
							x1: "0",
							y1: "0",
							x2: "1",
							y2: "1",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									stopColor: "#edfaff",
									stopOpacity: ".38"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: ".42",
									stopColor: "#b9cadd",
									stopOpacity: ".03"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: "1",
									stopColor: "#e4dfff",
									stopOpacity: ".18"
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("linearGradient", {
							id: id + "-smoke",
							x1: "1",
							y1: "0",
							x2: "0",
							y2: "1",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
								stopColor: "#060c1c",
								stopOpacity: ".36"
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
								offset: "1",
								stopColor: "#8196b8",
								stopOpacity: ".05"
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("linearGradient", {
							id: id + "-cool",
							x1: "0",
							y1: "1",
							x2: "1",
							y2: "0",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									stopColor: "#a6dfd5",
									stopOpacity: ".23"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: ".6",
									stopColor: "#a6b6e6",
									stopOpacity: ".02"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: "1",
									stopColor: "#fff5e6",
									stopOpacity: ".22"
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("linearGradient", {
							id: id + "-edge-mask",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", { stopColor: "#fff" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: ".14",
									stopColor: "#b0b0b0"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: ".3",
									stopColor: "#303030"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: ".7",
									stopColor: "#303030"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: ".88",
									stopColor: "#aaa"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: "1",
									stopColor: "#fff"
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("linearGradient", {
							id: id + "-top-mask",
							x1: "0",
							y1: "0",
							x2: "0",
							y2: "1",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", { stopColor: "#fff" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
								offset: "1",
								stopColor: "#fff",
								stopOpacity: "0"
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("mask", {
							id: id + "-readable-center",
							maskUnits: "userSpaceOnUse",
							x: "0",
							y: "0",
							width: "464",
							height: "720",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
								width: "464",
								height: "720",
								fill: `url(#${id}-edge-mask)`
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
								width: "464",
								height: "75",
								fill: `url(#${id}-top-mask)`
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("filter", {
							id: id + "-frost",
							x: "0",
							y: "0",
							width: "100%",
							height: "100%",
							colorInterpolationFilters: "sRGB",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("feTurbulence", {
								type: "fractalNoise",
								baseFrequency: ".82",
								numOctaves: "2",
								seed: "17",
								stitchTiles: "stitch"
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("feColorMatrix", {
								type: "saturate",
								values: "0"
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("linearGradient", {
							id: id + "-rim",
							x1: "0",
							y1: "0",
							x2: "1",
							y2: "1",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									stopColor: "#f3fcff",
									stopOpacity: ".45"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: ".42",
									stopColor: "#c9e0ed",
									stopOpacity: ".1"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
									offset: "1",
									stopColor: "#071021",
									stopOpacity: ".35"
								})
							]
						})
					] }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
						mask: `url(#${id}-readable-center)`,
						children: [facets.map((points, index) => {
							const center = {
								x: points.reduce((sum, p) => sum + p.x, 0) / 3,
								y: points.reduce((sum, p) => sum + p.y, 0) / 3
							};
							const inset = points.map((p) => ({
								x: p.x + (center.x - p.x) * .12,
								y: p.y + (center.y - p.y) * .12
							}));
							const polygon = (vertices) => vertices.map((p) => p.x + "," + p.y).join(" ");
							return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
								"data-crystal-cell": true,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("polygon", {
										points: polygon(points),
										fill: "rgba(3,9,22,.25)",
										transform: "translate(2 2.7)"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("polygon", {
										"data-crystal-face": true,
										points: polygon(inset),
										fill: `url(#${id}-${[
											"silver",
											"smoke",
											"cool",
											"smoke",
											"silver",
											"smoke"
										][index % 6]})`
									}),
									points.map((p, side) => {
										const q = points[(side + 1) % 3];
										const length = Math.hypot(q.x - p.x, q.y - p.y);
										const light = (-(q.y - p.y) * .6 + (q.x - p.x) * .8) / length;
										return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("polygon", {
											"data-crystal-bevel": true,
											points: polygon([
												p,
												q,
												inset[(side + 1) % 3],
												inset[side]
											]),
											fill: light > 0 ? "rgba(225,247,255," + (.14 + light * .32) + ")" : "rgba(4,12,30," + (.12 - light * .28) + ")"
										}, side);
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("polygon", {
										points: polygon(points),
										fill: "none",
										stroke: "rgba(224,243,255,.11)",
										strokeWidth: ".55",
										vectorEffect: "non-scaling-stroke"
									})
								]
							}, index);
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M0 0 78 56 0 151M464 0 380 70 464 160M0 338 92 434 0 551M464 338 372 447 464 551M0 720 70 638 143 720M464 720 393 642 318 720",
							fill: "none",
							stroke: "rgba(235,251,255,.36)",
							strokeWidth: ".8",
							vectorEffect: "non-scaling-stroke"
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
						"data-crystal-frost": true,
						width: "464",
						height: "720",
						fill: "#fff",
						filter: `url(#${id}-frost)`,
						opacity: ".095"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
						x: "2",
						y: "2",
						width: "460",
						height: "716",
						rx: "18",
						fill: "none",
						stroke: `url(#${id}-rim)`,
						strokeWidth: "2.5",
						vectorEffect: "non-scaling-stroke"
					})
				]
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
					width: rect?.width ?? 100,
					height: rect?.height ?? 100
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
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(CrystalFacets, {}),
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
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(TransformDevice, {
						size: 100,
						expanded
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
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
		var firefly_default = "[data-firefly-root] {\n  --ff-accent: #9cebb8;\n  --ff-ink: #e2e7f2;\n  --ff-muted: #b4c1d7;\n  --ff-line: rgb(119 131 176 / 22%);\n  --dsw-alias-label-primary: #e2e7f2;\n  --dsw-alias-label-secondary: #b7c0d6;\n  --dsw-alias-label-tertiary: #8e9db9;\n  --dsw-alias-bg-base: #101626;\n  --dsw-alias-markdown-code-block: #11182b;\n  --dsw-alias-markdown-code-block-banner: #20233c;\n  --dsw-alias-markdown-inline-code: #283049;\n  --dsw-alias-state-business-primary: #9cebb8;\n  color: var(--ff-ink);\n  color-scheme: dark;\n  font: 13px/1.6 var(--dsw-font-family, system-ui, sans-serif);\n}\n[data-firefly-root] *, [data-firefly-settings] * { box-sizing: border-box; }\n[data-firefly-root] button, [data-firefly-root] textarea, [data-firefly-root] select { font: inherit; }\n[data-firefly-root] button { cursor: pointer; }\n[data-firefly-root] button:disabled { cursor: default; opacity: .38; }\n[data-firefly-root] button:focus-visible, [data-firefly-root] select:focus-visible { outline: 2px solid var(--ff-accent); outline-offset: 3px; }\n[data-firefly-root].dsh-firefly-assistant-dock { position: fixed; z-index: 50; display: flex; flex-direction: column; align-items: flex-end; gap: 8px; max-width: calc(100vw - 16px); pointer-events: none; }\n[data-firefly-root] .ff-panel {\n  position: relative; isolation: isolate; width: min(464px, calc(100vw - 16px));\n  height: min(720px, calc(100dvh - 126px)); max-height: calc(100dvh - 126px);\n  display: flex; flex-direction: column; overflow: hidden; pointer-events: auto;\n  border: 1px solid rgb(222 232 255 / 30%); border-radius: 20px;\n  background: linear-gradient(145deg, rgb(27 27 47 / 62%), rgb(10 18 32 / 72%));\n  -webkit-backdrop-filter: blur(20px) saturate(145%) brightness(.58); backdrop-filter: blur(20px) saturate(145%) brightness(.58);\n  box-shadow: 0 22px 65px rgb(0 0 0 / 24%), 0 3px 18px rgb(64 41 111 / 12%), inset 0 1px 0 rgb(255 255 255 / 27%), inset 2px 2px 1px rgb(255 255 255 / 12%), inset -3px -4px 3px rgb(3 9 24 / 44%), inset 0 0 12px rgb(218 236 255 / 5%);\n}\n[data-firefly-root] .ff-panel::before { content: ''; position: absolute; inset: 0; z-index: -1; pointer-events: none; border-radius: inherit; background: linear-gradient(118deg, rgb(238 247 255 / 8%), transparent 29%, transparent 73%, rgb(139 238 208 / 5%)); }\n[data-firefly-root] .ff-panel::after { content: ''; position: absolute; top: 0; left: 24px; right: 24px; height: 1px; pointer-events: none; background: linear-gradient(90deg, transparent, rgb(246 252 255 / 70%), rgb(166 228 226 / 28%), transparent); }\n[data-firefly-root] .dshfa-crystal-facets { position: absolute; inset: 0; z-index: -1; width: 100%; height: 100%; border-radius: inherit; pointer-events: none; overflow: hidden; }\n[data-firefly-root] .ff-header { flex: none; display: flex; align-items: center; gap: 10px; padding: 17px 18px 13px; }\n[data-firefly-root] .ff-wordmark { display: flex; gap: 9px; align-items: center; min-width: 0; flex: 1; }\n[data-firefly-root] .ff-header-device { width: 35px; height: 38px; display: grid; place-items: center; }\n[data-firefly-root] h2 { margin: 0; font-size: 14px; font-weight: 560; letter-spacing: .06em; }\n[data-firefly-root] .ff-subtitle { color: var(--ff-muted); font-size: 10px; margin: 1px 0 0; letter-spacing: .06em; }\n[data-firefly-root] .ff-header-actions { display: flex; gap: 2px; }\n[data-firefly-root] .ff-icon { width: 27px; height: 29px; display: grid; place-items: center; padding: 0; color: #a1acce; background: none; border: none; border-radius: 7px; }\n[data-firefly-root] .ff-icon:hover:not(:disabled) { background: rgb(227 240 234 / 8%); color: #e9edff; }\n[data-firefly-root] .ff-grip { cursor: grab; touch-action: none; }\n[data-firefly-root] .ff-grip:active { cursor: grabbing; }\n[data-firefly-root] .ff-context { flex: none; display: flex; align-items: center; flex-wrap: wrap; gap: 6px; margin: 0 20px; padding: 0 0 12px; border-bottom: 1px solid var(--ff-line); color: var(--ff-muted); font-size: 10px; }\n[data-firefly-root] .ff-context-path { max-width: 190px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n[data-firefly-root] .ff-context-divider { color: #667197; }\n[data-firefly-root] .ff-status { display: inline-flex; align-items: center; gap: 6px; color: var(--ff-accent); font-size: 10px; }\n[data-firefly-root] .ff-status-dot { display: inline-block; width: 4px; height: 4px; flex: none; background: currentColor; border-radius: 50%; box-shadow: 0 0 7px rgb(128 232 192 / 30%); }\n[data-firefly-root] .ff-scroll { flex: 1; min-height: 0; overflow: auto; padding: 15px 20px; overscroll-behavior: contain; scrollbar-width: thin; scrollbar-color: #495578 transparent; }\n[data-firefly-root] .ff-welcome { display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding: 4px 6px 16px; text-align: center; }\n[data-firefly-root] .ff-welcome h3 { margin: 0 0 8px; font-size: 17px; line-height: 1.5; font-weight: 450; letter-spacing: .01em; color: #e8e6f7; }\n[data-firefly-root] .ff-welcome p { margin: 0; max-width: 280px; color: #a5afc8; font-size: 12px; line-height: 1.9; }\n[data-firefly-root] .ff-eyebrow { display: block; margin-bottom: 9px; color: #9eb1d2; font-size: 9px; letter-spacing: .19em; text-transform: uppercase; }\n[data-firefly-root] .ff-setup { margin-top: 16px; width: 100%; text-align: left; }\n[data-firefly-root] .ff-setup label { display: block; color: var(--ff-muted); font-size: 11px; margin: 0 0 7px; }\n[data-firefly-root] .ff-setup select { width: 100%; height: 38px; border: 1px solid rgb(193 207 235 / 22%); border-radius: 10px; background: rgb(12 21 38 / 28%); color: var(--ff-ink); padding: 0 10px; }\n[data-firefly-root] .ff-setup option { background: #192039; color: #e2e7f2; }\n[data-firefly-root] .ff-start { margin-top: 10px; width: 100%; border: 1px solid rgb(204 233 220 / 35%); color: #13281e; background: linear-gradient(120deg, #b4dac5, #8bcab2); padding: 9px 12px; font-size: 12px; font-weight: 550; border-radius: 10px; }\n[data-firefly-root] .ff-start:hover:not(:disabled) { background: #b6e4cf; }\n[data-firefly-root] .ff-setup-note { margin-top: 10px !important; font-size: 10px !important; line-height: 1.65 !important; opacity: .8; }\n[data-firefly-root] .ff-suggestions { display: flex; justify-content: center; flex-wrap: wrap; gap: 7px; margin: 24px 0 0; }\n[data-firefly-root] .ff-suggestions button { background: rgb(59 56 88 / 24%); border: 1px solid rgb(170 166 210 / 23%); color: #c0badf; font-size: 11px; padding: 6px 11px; border-radius: 9px; transition: background .2s, border-color .2s; }\n[data-firefly-root] .ff-suggestions button:hover { background: rgb(175 213 193 / 12%); border-color: #719785; }\n[data-firefly-root] .ff-message { margin: 0 0 21px; }\n[data-firefly-root] .ff-message-author { display: flex; gap: 7px; align-items: center; margin-bottom: 7px; color: #9cebb8; font-size: 10px; letter-spacing: .035em; }\n[data-firefly-root] .ff-user { display: flex; justify-content: flex-end; }\n[data-firefly-root] .ff-user-text { max-width: 91%; padding: 10px 13px; background: rgb(75 85 121 / 26%); border: 1px solid rgb(197 211 235 / 16%); border-radius: 14px 14px 4px 14px; white-space: pre-wrap; overflow-wrap: anywhere; color: #e0e7f6; font-size: 12px; }\n[data-firefly-root] .ff-message-body { color: #d8dff0; font-size: 12px; line-height: 1.85; overflow-wrap: anywhere; min-width: 0; }\n[data-firefly-root] .ff-message-body > * { font-size: inherit; line-height: inherit; }\n[data-firefly-root] .ff-message-body pre { max-width: 100%; font-size: 11px; }\n[data-firefly-root] .ff-message-body h1, [data-firefly-root] .ff-message-body h2, [data-firefly-root] .ff-message-body h3 { font-size: 14px; }\n[data-firefly-root] .ff-message-body img { max-width: 100%; }\n[data-firefly-root] .ff-typing { display: inline-flex; gap: 4px; padding: 8px 0; }\n[data-firefly-root] .ff-typing i { width: 4px; height: 4px; background: #a1d9bc; border-radius: 50%; animation: ff-dot 2.4s ease-in-out infinite; }\n[data-firefly-root] .ff-typing i:nth-child(2) { animation-delay: .25s; }\n[data-firefly-root] .ff-typing i:nth-child(3) { animation-delay: .5s; }\n@keyframes ff-dot { 0%, 100% { opacity: .35; } 50% { opacity: 1; } }\n[data-firefly-root] .ff-activity { padding: 8px 0; font-size: 11px; color: #9ebaae; display: flex; align-items: center; gap: 7px; }\n[data-firefly-root] .ff-activity [data-spinner] { width: 10px; height: 10px; border: 1px solid rgb(161 228 205 / 25%); border-top-color: #9cebb8; border-radius: 50%; animation: ff-spin 2s linear infinite; }\n@keyframes ff-spin { to { transform: rotate(360deg); } }\n[data-firefly-root] .ff-compose-area { flex: none; padding: 0 14px 13px; }\n[data-firefly-root] .ff-compose { background: rgb(10 18 33 / 28%); border: 1px solid rgb(194 218 222 / 28%); border-radius: 16px; box-shadow: inset 0 1px 0 rgb(255 255 255 / 8%); transition: border-color .2s; }\n[data-firefly-root] .ff-compose:focus-within { border-color: rgb(160 218 189 / 42%); box-shadow: 0 0 0 2px rgb(138 207 174 / 3%); }\n[data-firefly-root] textarea { display: block; width: 100%; height: 68px; min-height: 54px; max-height: 136px; margin: 0; padding: 13px 14px 5px; resize: vertical; border: 0; outline: 0; color: #e0e7f6; -webkit-text-fill-color: #e0e7f6; caret-color: #9cebb8; background: transparent; font-size: 12px; line-height: 1.65; }\n[data-firefly-root] .ff-compose textarea:focus,\n[data-firefly-root] .ff-compose textarea:focus-visible { outline: none !important; box-shadow: none !important; border: 0 !important; }\n[data-firefly-root] textarea::placeholder { color: #8e9ebc; -webkit-text-fill-color: #8e9ebc; opacity: 1; }\n[data-firefly-root] .ff-compose-footer { display: flex; align-items: center; gap: 8px; padding: 5px 8px 8px 13px; }\n[data-firefly-root] .ff-compose-hint { color: #97a6c2; font-size: 9px; flex: 1; }\n[data-firefly-root] .ff-send { display: grid; place-items: center; width: 31px; height: 31px; flex: none; border: 0; border-radius: 10px; color: #102421; background: #9ad5b4; }\n[data-firefly-root] .ff-send:hover:not(:disabled) { background: #c3ead4; }\n[data-firefly-root] .ff-footer-line { display: flex; align-items: center; justify-content: space-between; margin: 8px 6px 0; font-size: 9px; color: #97a3bc; }\n[data-firefly-root] .ff-chat-link, [data-firefly-root] .ff-load-more { border: none; color: #a1d8c6; background: none; padding: 0; font-size: 10px; }\n[data-firefly-root] .ff-load-more { display: block; margin: 0 auto 18px; }\n[data-firefly-root] .ff-chat-link:hover, [data-firefly-root] .ff-load-more:hover { color: #c8f3df; text-decoration: underline; text-underline-offset: 3px; }\n[data-firefly-root] .ff-notice { margin: 0 0 10px; padding: 9px 11px; border: 1px solid rgb(228 180 99 / 18%); border-radius: 10px; color: #d7bd8b; background: rgb(213 161 81 / 5%); font-size: 11px; overflow-wrap: anywhere; }\n[data-firefly-root] .ff-notice[data-error] { color: #e0a0b0; border-color: rgb(210 134 134 / 25%); background: rgb(146 75 75 / 7%); }\n[data-firefly-root] .ff-notice button { color: inherit; }\n[data-firefly-root] .ff-confirm { padding: 15px 18px; background: rgb(39 34 62 / 70%); border-bottom: 1px solid rgb(166 155 206 / 25%); font-size: 12px; flex: none; }\n[data-firefly-root] .ff-confirm p { margin: 0 0 8px; }\n[data-firefly-root] .ff-confirm-actions { display: flex; gap: 12px; }\n[data-firefly-root] .ff-confirm button { border: 1px solid #667f6e; border-radius: 7px; background: none; color: #c9d1e6; padding: 4px 12px; }\n[data-firefly-root] .ff-launcher { position: relative; display: grid; place-items: center; width: 100px; height: 100px; padding: 0; flex: none; border: 0; border-radius: 24px; background: none; color: #d3f5e5; touch-action: none; pointer-events: auto; isolation: isolate; }\n[data-firefly-root] .ff-launcher svg { width: 100%; height: 100%; filter: drop-shadow(0 6px 5px rgb(0 0 0 / 35%)); transition: transform .4s ease; }\n[data-firefly-root] .ff-launcher:hover svg { transform: translateY(-2px); }\n[data-firefly-root] .dshfa-light-wing { transform-box: view-box; transition: transform .72s cubic-bezier(.22,.75,.25,1); }\n[data-firefly-root] [data-wing-side='left'] .dshfa-light-wing-upper { transform-origin: 96px 65px; transform: rotate(-54deg); }\n[data-firefly-root] [data-wing-side='right'] .dshfa-light-wing-upper { transform-origin: 162px 63px; transform: rotate(61deg); }\n[data-firefly-root] [data-wing-side='left'] .dshfa-light-wing-lower { transform-origin: 102px 118px; transform: rotate(-28deg); }\n[data-firefly-root] [data-wing-side='right'] .dshfa-light-wing-lower { transform-origin: 153px 124px; transform: rotate(26deg); }\n[data-firefly-root] .dshfa-light-wing-lower { transition-delay: .06s; }\n[data-firefly-root] [data-wing-state='open'] [data-wing-side] .dshfa-light-wing { transform: rotate(0deg); }\n[data-firefly-root] .ff-launcher .ff-device-core { opacity: .8; filter: drop-shadow(0 0 .5px rgb(97 217 194 / 35%)); }\n[data-firefly-root] .ff-launcher .ff-device-wing { opacity: .78; }\n[data-firefly-root] .ff-launcher[aria-expanded='true'] .ff-device-wing { opacity: .95; }\n[data-firefly-root] .ff-launcher[aria-expanded='true'] .ff-device-core { opacity: 1; filter: drop-shadow(0 0 2px rgb(98 238 209 / 65%)); }\n[data-firefly-root] .dshfa-wing-fire { opacity: 0; pointer-events: none; filter: drop-shadow(0 0 3px rgb(46 241 193 / 85%)); }\n[data-firefly-root] .dshfa-fire-rim { stroke-dasharray: 27 5 12 6; }\n[data-firefly-root] .dshfa-fire-stream { stroke-dasharray: 17 83; stroke-dashoffset: 100; }\n[data-firefly-root] .dshfa-fire-stream-secondary { stroke-dasharray: 10 90; }\n[data-firefly-root] .dshfa-fire-ember { stroke-dasharray: 2 98; stroke-dashoffset: 100; }\n[data-firefly-root] [data-wing-side='left'] { --dshfa-fire-dx: -3px; --dshfa-fire-delay: -.6s; }\n[data-firefly-root] [data-wing-side='right'] { --dshfa-fire-dx: 3px; --dshfa-fire-delay: -1.5s; }\n[data-firefly-root] .dshfa-light-wing-lower { --dshfa-fire-delay: -1s; }\n[data-firefly-root] .ff-launcher:focus-visible .ff-device-core { animation: dshfa-device-breathe 2.8s ease-in-out infinite alternate; }\n[data-firefly-root] .ff-launcher:focus-visible .ff-device-wing { opacity: 1; }\n[data-firefly-root] .ff-launcher:focus-visible .dshfa-wing-fire { opacity: 1; }\n[data-firefly-root] .ff-launcher:focus-visible .dshfa-flame-tongue { animation: dshfa-wing-burn 2.6s ease-in-out infinite alternate; animation-delay: var(--dshfa-fire-delay); }\n[data-firefly-root] .ff-launcher:focus-visible .dshfa-fire-rim { animation: dshfa-fire-rim-flow 3.2s linear infinite; }\n[data-firefly-root] .ff-launcher:focus-visible .dshfa-fire-stream { animation: dshfa-wing-flow 1.9s linear infinite; animation-delay: var(--dshfa-fire-delay); }\n[data-firefly-root] .ff-launcher:focus-visible .dshfa-fire-stream-secondary { animation-duration: 2.7s; }\n[data-firefly-root] .ff-launcher:focus-visible .dshfa-fire-ember { animation: dshfa-wing-flow 3.6s linear infinite; animation-delay: var(--dshfa-fire-delay); }\n@media (hover: hover) {\n  [data-firefly-root] .ff-launcher:hover .ff-device-core { animation: dshfa-device-breathe 2.8s ease-in-out infinite alternate; }\n  [data-firefly-root] .ff-launcher:hover .ff-device-wing { opacity: 1; }\n  [data-firefly-root] .ff-launcher:hover .dshfa-wing-fire { opacity: 1; }\n  [data-firefly-root] .ff-launcher:hover .dshfa-flame-tongue { animation: dshfa-wing-burn 2.6s ease-in-out infinite alternate; animation-delay: var(--dshfa-fire-delay); }\n  [data-firefly-root] .ff-launcher:hover .dshfa-fire-rim { animation: dshfa-fire-rim-flow 3.2s linear infinite; }\n  [data-firefly-root] .ff-launcher:hover .dshfa-fire-stream { animation: dshfa-wing-flow 1.9s linear infinite; animation-delay: var(--dshfa-fire-delay); }\n  [data-firefly-root] .ff-launcher:hover .dshfa-fire-stream-secondary { animation-duration: 2.7s; }\n  [data-firefly-root] .ff-launcher:hover .dshfa-fire-ember { animation: dshfa-wing-flow 3.6s linear infinite; animation-delay: var(--dshfa-fire-delay); }\n}\n@keyframes dshfa-wing-flow { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }\n@keyframes dshfa-fire-rim-flow { from { stroke-dashoffset: 50; } to { stroke-dashoffset: 0; } }\n@keyframes dshfa-wing-burn {\n  0% { opacity: .5; transform: translate(0, 0); }\n  45% { opacity: .85; transform: translate(var(--dshfa-fire-dx), -2px); }\n  100% { opacity: 1; transform: translate(0, 3px); }\n}\n@keyframes dshfa-device-breathe {\n  from { opacity: .72; filter: drop-shadow(0 0 1px rgb(98 238 209 / 22%)); }\n  to { opacity: 1; filter: drop-shadow(0 0 4px rgb(105 244 214 / 78%)); }\n}\n[data-firefly-root] .ff-orb-dot { position: absolute; bottom: 10px; right: 15px; height: 4px; width: 4px; background: #a7e9c7; border-radius: 50%; }\n[data-firefly-root][data-state='question'] .ff-orb-dot, [data-firefly-root][data-state='approval'] .ff-orb-dot { background: #e5b96b; }\n[data-firefly-root][data-state='failed'] .ff-orb-dot { background: #de9696; }\n[data-firefly-settings] { font: 13px/1.6 var(--dsw-font-family, system-ui, sans-serif); color: var(--dsw-alias-label-primary, #293931); padding: 16px 0; }\n[data-firefly-settings] .ff-settings-heading { display: flex; align-items: center; justify-content: space-between; gap: 20px; }\n[data-firefly-settings] .ff-settings-title { font-size: 14px; font-weight: 550; }\n[data-firefly-settings] p { margin: 6px 0 0; max-width: 420px; color: var(--dsw-alias-label-secondary, #63766b); font-size: 12px; }\n[data-firefly-settings] .ff-switch { position: relative; width: 38px; height: 22px; display: inline-flex; flex: none; }\n[data-firefly-settings] .ff-switch input { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; margin: 0; }\n[data-firefly-settings] .ff-switch span { pointer-events: none; width: 38px; height: 22px; border-radius: 20px; background: #71897c; }\n[data-firefly-settings] .ff-switch span::after { content: ''; display: block; width: 16px; height: 16px; margin: 3px; background: #eef7f1; border-radius: 50%; transition: transform .2s; }\n[data-firefly-settings] .ff-switch input:checked + span { background: #357b62; }\n[data-firefly-settings] .ff-switch input:checked + span::after { transform: translateX(16px); }\n[data-firefly-settings] .ff-switch input:focus-visible + span { outline: 2px solid #428469; outline-offset: 3px; }\n[data-firefly-settings] .ff-reset { font: inherit; background: transparent; border: 1px solid #81968a; border-radius: 8px; color: inherit; padding: 5px 10px; margin-top: 12px; cursor: pointer; }\n@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) { [data-firefly-root] .ff-panel { background: #151b2e; } }\n@media (prefers-reduced-motion: reduce) { [data-firefly-root] *, [data-firefly-root] *::before, [data-firefly-settings] *::after { animation: none !important; transition: none !important; } }\n@media (max-height: 520px) { [data-firefly-root] .ff-panel { height: calc(100dvh - 94px); max-height: calc(100dvh - 94px); border-radius: 16px; } [data-firefly-root] .ff-header { padding: 8px 14px; } [data-firefly-root] .ff-context { padding-bottom: 5px; } [data-firefly-root] .ff-compose-area { padding-bottom: 7px; } [data-firefly-root] .ff-launcher { height: 68px; width: 68px; } [data-firefly-root] .ff-welcome-device { display: none; } [data-firefly-root] textarea { min-height: 40px; height: 40px; } }\n@media (forced-colors: active) { [data-firefly-root] .ff-panel { background: Canvas; color: CanvasText; border-color: CanvasText; box-shadow: none; } [data-firefly-root] button { forced-color-adjust: auto; } }\n\n[data-firefly-root] .ff-studio-area { flex: none; margin: 0 14px; padding-top: 8px; }\n[data-firefly-root] [data-firefly-studio] { width: 100%; border: 1px solid rgb(176 202 240 / 23%); border-radius: 12px; overflow: hidden; background: rgb(11 16 32 / 18%); box-shadow: inset 0 1px 0 rgb(255 255 255 / 8%); }\n[data-firefly-root] [data-firefly-studio] > svg { display: block; width: 100%; max-height: 194px; }\n[data-firefly-root] .ff-studio-caption { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 7px 3px 5px; color: #a0b5c0; font-size: 10px; }\n[data-firefly-root] .ff-studio-caption > span:last-child { font-size: 9px; color: #8492ab; }\n[data-firefly-root] .ff-worker-head { animation: ff-office-idle 6s steps(2, end) infinite; animation-delay: var(--ff-worker-delay); }\n[data-firefly-root] [data-mode='working'] .ff-worker-arms { animation: ff-office-type 1.3s steps(2, end) infinite; animation-delay: var(--ff-worker-delay); }\n[data-firefly-root] [data-mode='working'] .ff-screen-lines { animation: ff-office-screen 2.4s steps(2, end) infinite; animation-delay: var(--ff-worker-delay); }\n[data-firefly-root] [data-mode='waiting'] .ff-worker-head { animation: ff-office-wait 3s ease-in-out infinite; animation-delay: var(--ff-worker-delay); }\n[data-firefly-root] [data-mode='error'] .ff-screen-lines { fill: #d28e79; }\n@keyframes ff-office-idle { 0%, 85%, 100% { transform: translateY(0); } 90% { transform: translateY(1px); } }\n@keyframes ff-office-type { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }\n[data-firefly-root] [data-mode='working'] [data-pose='reading'] .ff-worker-arms { animation: ff-office-read 4.2s ease-in-out infinite; animation-delay: var(--ff-worker-delay); }\n[data-firefly-root] [data-mode='working'] [data-pose='sketching'] .ff-worker-arms { animation: ff-office-sketch 2.2s steps(3, end) infinite; animation-delay: var(--ff-worker-delay); }\n@keyframes ff-office-read { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1px); } }\n@keyframes ff-office-sketch { 0%, 100% { transform: translate(0, 0); } 40% { transform: translate(1px, -1px); } 70% { transform: translate(-1px, 0); } }\n@keyframes ff-office-screen { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }\n@keyframes ff-office-wait { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }\n@media (max-height: 620px) {\n  [data-firefly-root] .ff-studio-area { margin: 0 10px; padding-top: 3px; }\n  [data-firefly-root] [data-firefly-studio] > svg { max-height: 105px; }\n  [data-firefly-root] .ff-studio-caption { padding: 2px; font-size: 9px; }\n  [data-firefly-root] .ff-panel { height: calc(100dvh - 94px); max-height: calc(100dvh - 94px); }\n  [data-firefly-root] .ff-header { padding: 8px 12px; }\n  [data-firefly-root] .ff-scroll { padding: 8px 14px; }\n}\n@media (max-height: 450px) { [data-firefly-root] [data-firefly-studio] > svg { max-height: 60px; } [data-firefly-root] .ff-studio-caption { display: none; } }\n\n[data-firefly-root] .ff-room-traces { stroke-dasharray: 18 38; animation: dshfa-room-flow 8s linear infinite; }\n[data-firefly-root] .ff-room-pulse { animation: dshfa-room-breathe 6s ease-in-out infinite alternate; }\n[data-firefly-root] .ff-desk-led { stroke-dasharray: 48 12; animation: dshfa-room-flow 9s linear infinite; animation-delay: var(--ff-worker-delay); }\n[data-firefly-root] .ff-keyboard-led { animation: dshfa-room-breathe 4.6s ease-in-out infinite alternate; animation-delay: var(--ff-worker-delay); }\n[data-firefly-root] .ff-pc-rotor { transform-box: fill-box; transform-origin: center; animation: dshfa-fan-spin 8s linear infinite; }\n[data-firefly-root] .ff-city-lights, [data-firefly-root] .ff-server-status { animation: dshfa-room-breathe 7.2s ease-in-out infinite alternate; }\n[data-firefly-root] .ff-city-traffic { stroke-dasharray: 7 18; animation: dshfa-room-flow 12s linear infinite; }\n[data-firefly-root] .ff-room-motes { animation: dshfa-mote-drift 9s ease-in-out infinite alternate; }\n[data-firefly-root] .ff-screen-stars { animation: dshfa-star-breathe 5s ease-in-out infinite alternate; animation-delay: var(--ff-worker-delay); }\n[data-firefly-root] .ff-screen-nebula { animation: dshfa-nebula-shift 12s ease-in-out infinite alternate; animation-delay: var(--ff-worker-delay); }\n[data-firefly-root] .ff-screen-train { animation: dshfa-train-cruise 10s ease-in-out infinite alternate; animation-delay: var(--ff-worker-delay); }\n[data-firefly-root] .ff-screen-scan { animation: dshfa-screen-scan 7s linear infinite; animation-delay: var(--ff-worker-delay); }\n[data-firefly-root] .ff-screen-lines { animation: ff-office-screen 4.8s ease-in-out infinite; animation-delay: var(--ff-worker-delay); }\n[data-firefly-root] .ff-worker-body { animation: dshfa-avatar-breathe 5.6s ease-in-out infinite alternate; animation-delay: var(--ff-worker-delay); }\n[data-firefly-root] [data-mode='idle'] .ff-worker-arms { animation: dshfa-avatar-rest 7s ease-in-out infinite; animation-delay: var(--ff-worker-delay); }\n[data-firefly-root] [data-mode='waiting'] .ff-worker-arms, [data-firefly-root] [data-mode='error'] .ff-worker-arms { animation: none; }\n@keyframes dshfa-room-flow { from { stroke-dashoffset: 56; } to { stroke-dashoffset: 0; } }\n@keyframes dshfa-room-breathe { from { opacity: .4; } to { opacity: .85; } }\n@keyframes dshfa-fan-spin { to { transform: rotate(360deg); } }\n@keyframes dshfa-mote-drift { from { opacity: .2; transform: translateY(0); } to { opacity: .7; transform: translateY(-4px); } }\n@keyframes dshfa-star-breathe { from { opacity: .5; } to { opacity: 1; } }\n@keyframes dshfa-nebula-shift { from { opacity: .5; transform: translateX(-5px); } to { opacity: .9; transform: translateX(5px); } }\n@keyframes dshfa-train-cruise { from { transform: translateX(-4px); } to { transform: translateX(5px); } }\n@keyframes dshfa-screen-scan { from { transform: translateY(0); } to { transform: translateY(112px); } }\n@keyframes dshfa-avatar-breathe { from { transform: translateY(0); } to { transform: translateY(-.8px); } }\n@keyframes dshfa-avatar-rest { 0%, 70%, 100% { transform: translateY(0); } 82% { transform: translateY(-1px); } }\n\n[data-firefly-root] .ff-desk-aura { animation: dshfa-floor-pool 6s ease-in-out infinite alternate; }\n@keyframes dshfa-floor-pool { from { opacity: .04; } to { opacity: .13; } }\n";
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
