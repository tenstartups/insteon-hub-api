ifeq ($(DOCKER_ARCH),armhf)
	DOCKER_IMAGE_NAME := tenstartups/insteon-hub-api:armhf
else
	DOCKER_ARCH := x64
	DOCKER_IMAGE_NAME := tenstartups/insteon-hub-api:latest
endif

build: Dockerfile.$(DOCKER_ARCH)
	docker build --file Dockerfile.$(DOCKER_ARCH) --tag $(DOCKER_IMAGE_NAME) .

clean_build: Dockerfile.$(DOCKER_ARCH)
	docker build --no-cache --pull --file Dockerfile.$(DOCKER_ARCH) --tag $(DOCKER_IMAGE_NAME) .

run: build
	docker run -it --rm \
		-e DEBUG=node-ssdp* \
		-e CONFIG_FILE=/etc/insteon-hub-api/config.yml \
		-e VIRTUAL_HOST=insteon-hub-api.docker \
		-e VIRTUAL_PORT=8080 \
		-e LISTEN_PORT=8080 \
		-v "$(PWD)/test":/etc/insteon-hub-api:ro \
		--name insteon-hub-api \
		$(DOCKER_IMAGE_NAME) $(ARGS)

push: build
	docker push $(DOCKER_IMAGE_NAME)
