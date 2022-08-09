package cz.inqool.dl4dh.feeder.exception;

import org.springframework.http.HttpStatus;

public class AccessDeniedException extends ServiceException {
    public AccessDeniedException() {
        super("You are not allowed to do this.");
    }

    public AccessDeniedException(String message) {
        super(message);
    }

    @Override
    public HttpStatus getStatus() {
        return HttpStatus.NOT_FOUND;
    }
}
