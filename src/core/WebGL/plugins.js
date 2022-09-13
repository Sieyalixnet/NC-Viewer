export function remove_max_min(max, min) {
    return (x) => {
        if (x == max || x == min) {
            return 0;
        } else { return x; }
    };
}
export function remove_default_value(max, min, default_value) {

    let default_v;
    if (Math.abs(max) >= Math.abs(min)) {
        default_v = max;
    } else if (Math.abs(max) < Math.abs(min)) {
        default_v = min;
    }

    return (x) => {
        if (x == default_v) {
            return default_value;
        } else { return x; }
    };
}
