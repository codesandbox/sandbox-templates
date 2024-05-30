export WORKSPACE_BASE=$(pwd)/sandbox

docker run \
    -it \
    --pull=always \
    -e LLM_API_KEY \
    -e SANDBOX_TYPE="exec" \
    -e SANDBOX_USER_ID=$(id -u) \
    -e WORKSPACE_MOUNT_PATH=$WORKSPACE_BASE \
    -v $WORKSPACE_BASE:/opt/workspace_base \
    -v /project/.docker/run/docker.sock:/var/run/docker.sock \
    -p 3000:3000 \
    --add-host host.docker.internal:host-gateway \
        ghcr.io/opendevin/opendevin:main