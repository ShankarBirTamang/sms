import t from "../algorithms/luhn";

export default function e() {
    return {
        validate(e) {
            return {
                valid:
                    e.value === "" || (/^\d{9}$/.test(e.value) && t(e.value)),
            };
        },
    };
}
