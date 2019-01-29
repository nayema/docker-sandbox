FROM bash:5.0

COPY hello.sh /

CMD ["bash", "/hello.sh"]
