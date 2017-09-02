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
		-v "$(PWD)/test":/etc/insteon-hub-api:ro \
		-v "$(PWD)/test":/var/lib/insteon-hub-api \
		-e VIRTUAL_HOST=insteon-hub-api.docker \
		-e VIRTUAL_PORT=8080 \
		-e CONFIG_FILE=/etc/insteon-hub-api/config.yml \
		-e DATABASE_FILE=/var/lib/insteon-hub-api/db.json \
		-e LISTEN_PORT=8080 \
		-e DEBUG=node-ssdp* \
		--net host \
		--name insteon-hub-api \
		$(DOCKER_IMAGE_NAME) $(ARGS)

run_local: build
	npm install && \
		CONFIG_FILE=./test/config.yml \
		DATABASE_FILE=./test/db.json \
		LISTEN_PORT=8080 \
		DEBUG=node-ssdp* \
		npm start

push: build
	docker push $(DOCKER_IMAGE_NAME)
