def simulate_attendance_risk(current_risk, old_attendance, new_attendance):
    """
    Simulates how dropout risk changes when attendance improves.
    This does NOT retrain the model.
    """

    # ❌ Do not allow decreasing attendance
    if new_attendance <= old_attendance:
        return current_risk

    improvement = new_attendance - old_attendance

    # Rule-based impact (domain logic)
    # Every +1% attendance → ~0.8% risk reduction
    reduction = improvement * 0.8

    new_risk = current_risk - reduction

    # Risk can never be negative
    return max(new_risk, 0)
