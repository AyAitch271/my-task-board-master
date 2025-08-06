export const taskStatuses = {
    in_progress: {
        value: 'in progress',
        column_bg: 'warm-yellow',
        status_icon: '../resources/Time_atack_duotone.svg',
        status_icon_bg: 'warm-orange'
    },
    completed: {
        value: 'completed',
        column_bg: 'light-green',
        status_icon: '../resources/Done_round_duotone.svg',
        status_icon_bg: 'warm-green'
    },
    will_not_do: {
        value: "won't do",
        column_bg: 'light-red',
        status_icon: '../resources/close_ring_duotone.svg',
        status_icon_bg: 'warm-red'
    },
    no_status: {
        value: 'no status',
        column_bg: 'light-grey',
        status_icon: '',
        status_icon_bg: 'inherit'
    }
}
