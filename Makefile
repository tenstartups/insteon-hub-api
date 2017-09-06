ifeq ($(DOCKER_ARCH),armhf)
	DOCKER_IMAGE_NAME := tenstartups/insteon-server:armhf
else
	DOCKER_ARCH := x64
	DOCKER_IMAGE_NAME := tenstartups/insteon-server:latest
endif

build: Dockerfile.$(DOCKER_ARCH)
	docker build --file Dockerfile.$(DOCKER_ARCH) --tag $(DOCKER_IMAGE_NAME) .

clean_build: Dockerfile.$(DOCKER_ARCH)
	docker build --no-cache --pull --file Dockerfile.$(DOCKER_ARCH) --tag $(DOCKER_IMAGE_NAME) .

run: build
	docker run -it --rm \
		-p 8080 \
		-v "$(PWD)/test":/etc/insteon-server:ro \
		-v "$(PWD)/test":/var/lib/insteon-server \
		-e DEBUG=node-ssdp* \
		-e CONFIG_FILE=/etc/insteon-server/config.yml \
		-e DATABASE_FILE=/var/lib/insteon-server/db.json \
		-e LISTEN_PORT=8080 \
		-e VIRTUAL_HOST=insteon-server.docker \
		--name insteon-server \
		$(DOCKER_IMAGE_NAME) $(ARGS)

run_local: build
	npm install && \
		CONFIG_FILE=./test/config.yml \
		DATABASE_FILE=./test/db.json \
		LISTEN_PORT=8080 \
		npm start

push: build
	docker push $(DOCKER_IMAGE_NAME)
