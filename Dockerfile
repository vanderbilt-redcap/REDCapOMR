FROM php:7.4-apache

ARG SDAPS_VERSION="${SDAPS_VERSION:-1.9.9}"

# update deps
RUN apt update \
	&& apt upgrade -y \
	&& apt install -y \
		libcairo-dev \
		libpgf-dev \
		libtiff-dev \
		libzbar-dev \
		lua5.3 \
		pkg-config \
		python3 \
		python3-cairo \
		python3-cairo-dev \
		python3-dev \
		python3-distutils \
		python3-distutils-extra \
		python3-opencv \
		texlive \
		texlive-latex-extra \
		texlive-latex-recommended \
		tzdata \
		unzip \
		wget


RUN cd / \
	&& wget "https://github.com/sdaps/sdaps/archive/refs/tags/${SDAPS_VERSION}.zip" \
	&& unzip "${SDAPS_VERSION}.zip" \
	&& rm "${SDAPS_VERSION}.zip" \
	&& cd "sdaps-${SDAPS_VERSION}/tex" \
	&& wget https://github.com/sdaps/sdaps-class/archive/refs/heads/master.zip \
	&& unzip "master.zip" \
	&& rm "master.zip" \
	&& rm -rf class \
	&& mv sdaps-class-master class

RUN cd "/sdaps-${SDAPS_VERSION}" \
	&& ./setup.py install --install-tex

# copy in apache config
COPY docker/conf/apache2/000-redcap-omr.conf "${APACHE_CONFDIR}/sites-available/000-redcap-omr.conf"
COPY docker/conf/apache2/ports.conf "${APACHE_CONFDIR}/ports.conf"

# copy in php config
COPY "docker/conf/php/php.ini" "${PHP_INI_DIR}/conf.d/redcap.ini"

# container cleanup and enable site
RUN  rm "${APACHE_CONFDIR}/sites-enabled/000-default.conf" \
     && ln -sf "${APACHE_CONFDIR}/sites-available/000-redcap.conf" "${APACHE_CONFDIR}/sites-enabled/000-redcap.conf" \
     && mv "${PHP_INI_DIR}/php.ini-development" "${PHP_INI_DIR}/php.ini"
