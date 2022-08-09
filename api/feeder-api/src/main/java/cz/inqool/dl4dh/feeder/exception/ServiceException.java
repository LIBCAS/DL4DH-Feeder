package cz.inqool.dl4dh.feeder.exception;

import org.springframework.http.HttpStatus;

public abstract class ServiceException extends RuntimeException{

    public ServiceException(String message) {
        super(message);
    }

    public abstract HttpStatus getStatus();

}
