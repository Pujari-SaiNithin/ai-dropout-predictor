def verify_login(email: str, password: str):
    username = email.split("@")[0]
    return password == f"{username}@123"
