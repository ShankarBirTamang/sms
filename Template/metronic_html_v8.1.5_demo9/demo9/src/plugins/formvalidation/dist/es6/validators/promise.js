import t from "../utils/call";

export default function r() {
    return {
        validate(r) {
            return t(r.options.promise, [r]);
        },
    };
}
