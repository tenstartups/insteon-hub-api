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
		-v "$(PWD)/tmp":/etc/insteon-server:ro \
		-v "$(PWD)/tmp":/var/lib/insteon-server \
		-e CONFIG_FILE=/etc/insteon-server/settings.yml \
		-e DATABASE_DIRECTORY=/var/lib/insteon-server \
		-e PORT=8080 \
		-e VIRTUAL_HOST=insteon-server.docker \
		--name insteon-server \
		$(DOCKER_IMAGE_NAME) $(ARGS)

run_local: build
	npm install && \
		DEBUG=node-ssdp* \
		CONFIG_FILE=./tmp/settings.yml \
		DATABASE_DIRECTORY=./tmp \
		PORT=8080 \
		npm start

push: build
	docker push $(DOCKER_IMAGE_NAME)
