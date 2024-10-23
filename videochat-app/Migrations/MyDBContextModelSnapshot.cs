﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace videochat_app.Migrations
{
    [DbContext(typeof(MyDBContext))]
    partial class MyDBContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.8")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("Models.Profile", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Avaliability")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string[]>("Certifications")
                        .HasColumnType("text[]");

                    b.Property<string>("CurrentRole")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string[]>("DatabasesUsed")
                        .HasColumnType("text[]");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string[]>("DevelopmentInterests")
                        .HasColumnType("text[]");

                    b.Property<string>("FirstName")
                        .HasColumnType("text");

                    b.Property<string[]>("Frameworks")
                        .HasColumnType("text[]");

                    b.Property<string>("GithubUrl")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("IdentityUserId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Industry")
                        .HasColumnType("text");

                    b.Property<string[]>("Languages")
                        .HasColumnType("text[]");

                    b.Property<string>("LastName")
                        .HasColumnType("text");

                    b.Property<string>("LinkedInUrl")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("Matches")
                        .HasColumnType("integer");

                    b.Property<string>("PortfolioUrl")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string[]>("ProgrammingLanguages")
                        .IsRequired()
                        .HasColumnType("text[]");

                    b.Property<int>("Sessions")
                        .HasColumnType("integer");

                    b.Property<string>("TwitterUrl")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Profiles");
                });

            modelBuilder.Entity("Models.Project", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<DateOnly?>("EndDate")
                        .HasColumnType("date");

                    b.Property<int?>("ProfileId")
                        .HasColumnType("integer");

                    b.Property<DateOnly?>("StartDate")
                        .HasColumnType("date");

                    b.Property<string>("description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("title")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string[]>("tools")
                        .IsRequired()
                        .HasColumnType("text[]");

                    b.HasKey("Id");

                    b.HasIndex("ProfileId");

                    b.ToTable("Project");
                });

            modelBuilder.Entity("Models.User", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("integer");

                    b.Property<string>("ConcurrencyStamp")
                        .HasColumnType("text");

                    b.Property<string>("Email")
                        .HasColumnType("text");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("boolean");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("boolean");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("NormalizedEmail")
                        .HasColumnType("text");

                    b.Property<string>("NormalizedUserName")
                        .HasColumnType("text");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("text");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("text");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("boolean");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("text");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("boolean");

                    b.Property<string>("UserName")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Models.Project", b =>
                {
                    b.HasOne("Models.Profile", null)
                        .WithMany("projects")
                        .HasForeignKey("ProfileId");
                });

            modelBuilder.Entity("Models.Profile", b =>
                {
                    b.Navigation("projects");
                });
#pragma warning restore 612, 618
        }
    }
}
