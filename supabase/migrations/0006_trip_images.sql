-- Migration 0006: Add cover_image and gallery_images to trips table

alter table public.trips add column if not exists cover_image text;
alter table public.trips add column if not exists gallery_images text[];
