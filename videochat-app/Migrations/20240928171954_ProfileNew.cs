using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace videochat_app.Migrations
{
    /// <inheritdoc />
    public partial class ProfileNew : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string[]>(
                name: "DatabasesUsed",
                table: "Profiles",
                type: "text[]",
                nullable: true,
                oldClrType: typeof(string[]),
                oldType: "text[]");

            migrationBuilder.AlterColumn<string>(
                name: "CurrentRole",
                table: "Profiles",
                type: "text",
                nullable: false,
                oldClrType: typeof(string[]),
                oldType: "text[]");

            migrationBuilder.AddColumn<string>(
                name: "FirstName",
                table: "Profiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LastName",
                table: "Profiles",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Project",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    title = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    tools = table.Column<string[]>(type: "text[]", nullable: false),
                    StartDate = table.Column<DateOnly>(type: "date", nullable: true),
                    EndDate = table.Column<DateOnly>(type: "date", nullable: true),
                    ProfileId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Project", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Project_Profiles_ProfileId",
                        column: x => x.ProfileId,
                        principalTable: "Profiles",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Project_ProfileId",
                table: "Project",
                column: "ProfileId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Project");

            migrationBuilder.DropColumn(
                name: "FirstName",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "LastName",
                table: "Profiles");

            migrationBuilder.AlterColumn<string[]>(
                name: "DatabasesUsed",
                table: "Profiles",
                type: "text[]",
                nullable: false,
                defaultValue: new string[0],
                oldClrType: typeof(string[]),
                oldType: "text[]",
                oldNullable: true);

            migrationBuilder.AlterColumn<string[]>(
                name: "CurrentRole",
                table: "Profiles",
                type: "text[]",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");
        }
    }
}
