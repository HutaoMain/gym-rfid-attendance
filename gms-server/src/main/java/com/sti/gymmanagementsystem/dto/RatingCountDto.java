package com.sti.gymmanagementsystem.dto;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RatingCountDto {

    private final int rating;
    private final long count;

    public RatingCountDto(int rating, long count) {
        this.rating = rating;
        this.count = count;
    }

}
