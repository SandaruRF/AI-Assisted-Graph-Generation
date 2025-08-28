import os
import platform
from functools import lru_cache


@lru_cache            # evaluate only once
def _running_in_docker() -> bool:
    """
    Docker places the file /.dockerenv inside every container[29].
    """
    return os.path.exists("/.dockerenv")


@lru_cache
def _localhost_gateway() -> str:
    """
    Return the gateway address that a container can use
    to reach services running on the host.
    """
    if not _running_in_docker():
        return "localhost"                      # bare-metal run

    # Inside Docker – choose the platform-specific gateway
    return (
        # "172.17.0.1" if platform.system() == "Linux"   # default Linux bridge
        # else "host.docker.internal"                    # Docker Desktop (Win/Mac)
        "host.docker.internal"     
    )


def resolve_database_host(host: str) -> str:
    """
    Translate localhost variants when necessary.
    Non-localhost values are returned unchanged.
    """
    if host.lower() in {"localhost", "127.0.0.1"}:
        return _localhost_gateway()
    return host