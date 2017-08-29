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
		-e VIRTUAL_HOST=insteon-hub-api.docker \
		-e VIRTUAL_PORT=8080 \
		-e LISTENER_PORT=8080 \
		-e INSTEON_HUB_ADDRESS=$(INSTEON_HUB_ADDRESS) \
		-e INSTEON_HUB_PORT=$(INSTEON_HUB_PORT) \
		-e INSTEON_HUB_USERNAME=$(INSTEON_HUB_USERNAME) \
		-e INSTEON_HUB_PASSWORD=$(INSTEON_HUB_PASSWORD) \
		-e LIGHT_SWITCH_DEVICES=$(LIGHT_SWITCH_DEVICES) \
		--name insteon-hub-api \
		$(DOCKER_IMAGE_NAME) $(ARGS)

push: build
	docker push $(DOCKER_IMAGE_NAME)
