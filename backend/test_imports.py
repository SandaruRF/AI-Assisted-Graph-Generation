print("Testing imports one by one...")

try:
    print("1. Testing FastAPI imports...")
    from fastapi import FastAPI, Request
    from fastapi.middleware.cors import CORSMiddleware
    print("✓ FastAPI imports OK")
except Exception as e:
    print(f"✗ FastAPI imports failed: {e}")

try:
    print("2. Testing app.config...")
    from app.config import settings
    print("✓ app.config OK")
except Exception as e:
    print(f"✗ app.config failed: {e}")

try:
    print("3. Testing database router...")
    from app.api.database import router as database_router
    print("✓ database router OK")
except Exception as e:
    print(f"✗ database router failed: {e}")

try:
    print("4. Testing users router...")
    from app.api.users import router as user_router
    print("✓ users router OK")
except Exception as e:
    print(f"✗ users router failed: {e}")

try:
    print("5. Testing passwd_reset router...")
    from app.api.passwd_reset import router as passwd_reset_router
    print("✓ passwd_reset router OK")
except Exception as e:
    print(f"✗ passwd_reset router failed: {e}")

try:
    print("6. Testing sql_database router...")
    from app.api.sql_database import router as database_connection_router
    print("✓ sql_database router OK")
except Exception as e:
    print(f"✗ sql_database router failed: {e}")

try:
    print("7. Testing web_socket router...")
    from app.api.web_socket import router as stream_ws_router
    print("✓ web_socket router OK")
except Exception as e:
    print(f"✗ web_socket router failed: {e}")

try:
    print("8. Testing googleauth router...")
    from app.api.googleauth import router as google_auth_router
    print("✓ googleauth router OK")
except Exception as e:
    print(f"✗ googleauth router failed: {e}")

try:
    print("9. Testing githubauth router...")
    from app.api.githubauth import router as github_auth_router
    print("✓ githubauth router OK")
except Exception as e:
    print(f"✗ githubauth router failed: {e}")

try:
    print("10. Testing graph_state_manager...")
    from app.state import graph_state_manager
    print("✓ graph_state_manager OK")
except Exception as e:
    print(f"✗ graph_state_manager failed: {e}")

try:
    print("11. Testing ui_customizer...")
    from app.agents.visualization_agent.ui_customizer import parse_customization_prompt
    print("✓ ui_customizer OK")
except Exception as e:
    print(f"✗ ui_customizer failed: {e}")

print("\nAll import tests completed!")